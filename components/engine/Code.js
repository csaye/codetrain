import dynamic from 'next/dynamic';

const CodeEditor = dynamic(import('../CodeEditor.js'), { ssr: false });

import styles from '../../styles/components/engine/Code.module.css';

export default function Code(props) {
  const {
    objectCount, currObject, codes, setCodes, objectNames, setObjectNames
  } = props;

  // updates current color with given value
  function updateCode(val) {
    const newCodes = codes.slice();
    newCodes[currObject] = val;
    setCodes(newCodes);
  }

  // updates current object name with given value
  function updateObjectName(val) {
    const newObjectNames = objectNames.slice();
    newObjectNames[currObject] = val;
    setObjectNames(newObjectNames);
  }

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        {
          currObject !== -1 ?
          <div className={styles.toolbar}>
            <input
              className={`${styles.nameinput} monospace`}
              value={objectNames[currObject]}
              onChange={e => updateObjectName(e.target.value)}
            />
          </div> :
          <p className={styles.placeholder}>Select an object to write code.</p>
        }
        <CodeEditor
          style={currObject === -1 ? { display: 'none' } : {}}
          value={currObject === -1 ? '' : codes[currObject]}
          onChange={val => updateCode(val)}
        />
      </div>
    </div>
  );
}
