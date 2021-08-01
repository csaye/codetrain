import Canvas from '../components/Canvas.js';
import Sprites from '../components/Sprites.js';

import dynamic from 'next/dynamic';

import styles from '../styles/Index.module.css';

const Editor = dynamic(import('../components/Editor.js'), { ssr: false });

export default function Index() {
  return (
    <div className={styles.container}>
      <Sprites />
      <Editor />
    </div>
  );
}
