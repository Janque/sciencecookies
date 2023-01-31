import { useState } from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-monokai";
//import "ace-builds/src-noconflict/ext-language_tools"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/components/codeEditor.module.scss';

export default function CustomEditor({ language, displayName, value, onChange }) {
    const [open, setOpen] = useState(true);

    return (
        <div className={`col ${styles['editor-container']} ${open ? '' : styles.collapsed}`}>
            <div className={styles['editor-title']}>
                {displayName}
                <button
                    type="button"
                    className={styles['expand-collapse-btn']}
                    onClick={() => setOpen(prevOpen => !prevOpen)}
                >
                    <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
                </button>
            </div>
            <AceEditor
                className={styles['code-mirror-wrapper']}
                mode={language}
                theme="monokai"
                onChange={onChange}
                editorProps={{
                    $blockScrolling: false,
                    wrapEnabled: true,
                    width: '100%'
                }}
                value={value}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                }}
            />
        </div >
    )
}