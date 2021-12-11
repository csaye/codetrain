import Link from 'next/link';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/pages/User.module.css';

export default function User(props) {
  const [user, setUser] = useState(undefined);
  const [editing, setEditing] = useState(false);
  const [descAbout, setDescAbout] = useState('');
  const [descWork, setDescWork] = useState('');

  // get user references
  const usersRef = firebase.firestore().collection('users');
  const userRef = user ? usersRef.doc(user.id) : undefined;
  const uid = firebase.auth().currentUser?.uid;
  const ownPage = uid === user?.id;

  // get username
  const router = useRouter();
  const { username } = router.query;

  // retrieves user uid data from firebase
  async function getUser() {
    // return if no username
    if (!username) return;
    // get and set user data
    const usernameLower = username.toLowerCase();
    const userQuery = usersRef.where('usernameLower', '==', usernameLower);
    const userDocs = (await userQuery.get()).docs;
    // set user
    const userDoc = userDocs[0];
    setUser(userDoc ? { id: userDoc.id, ...userDoc.data() } : null);
  }

  // get user data on start
  useEffect(() => {
    getUser();
  }, [username]);

  // refreshes user data
  async function refreshData() {
    // return if no current user
    if (!user) return;
    // retrieve user data
    const userDoc = await userRef.get();
    setUser({ id: userDoc.id, ...userDoc.data() });
  }

  // updates descriptions in firebase
  async function updateDescriptions() {
    await userRef.update({ descAbout, descWork });
    refreshData();
  }

  return (
    <div className={styles.container}>
      <Header {...props} />
      {
        user === undefined ?
        <Loading /> :
        !user ?
        <div className="notfound">
          <h1>User not found</h1>
          <Link href="/">
            <a className="bluelink">Return home</a>
          </Link>
        </div> :
        <div className={styles.content}>
          <div className={styles.head}>
            <div className={styles.title}>
              {
                ownPage ?
                <label>
                  <img src={user.photo} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => updatePhoto(e.target.files[0])}
                    hidden={true}
                  />
                </label> :
                <img src={user.photo} />
              }
              <div>
                <h1>{user.username}</h1>
                <p>
                  Joined
                  {' '}
                  {
                    new Date(user.joined)
                    .toLocaleDateString(undefined, { month: 'long' })
                  }
                  {' '}
                  {new Date(user.joined).getFullYear()}
                </p>
              </div>
            </div>
            <div className={styles.description}>
              {
                editing ?
                <>
                  <label>
                    About Me
                    <input
                      value={descAbout}
                      onChange={e => setDescAbout(e.target.value)}
                      maxLength="2048"
                    />
                  </label>
                  <label>
                    What I&apos;m working on
                    <input
                      value={descWork}
                      onChange={e => setDescWork(e.target.value)}
                      maxLength="2048"
                    />
                  </label>
                </> :
                <>
                  <p>About me: {user.descAbout}</p>
                  <p>What I&apos;m working on: {user.descWork}</p>
                </>
              }
              {
                ownPage &&
                (
                  editing ?
                  <button onClick={() => {
                    updateDescriptions();
                    setEditing(false);
                  }}>
                    <SaveIcon />
                  </button> :
                  <button onClick={() => {
                    setDescAbout(user.descAbout ?? '');
                    setDescWork(user.descWork ?? '');
                    setEditing(true);
                  }}>
                    <EditIcon />
                  </button>
                )
              }
            </div>
          </div>
        </div>
      }
    </div>
  );
}
