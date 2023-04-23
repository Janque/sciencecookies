import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function ToolBar({ children }) {
    return <div className="tbar tbar-right btn-toolbar mb-3" role="toolbar">
        <ButtonGroup vertical>
            {children}
        </ButtonGroup>
    </div >
}