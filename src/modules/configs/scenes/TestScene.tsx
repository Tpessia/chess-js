import { NotificationService } from '@/services/NotificationService';
import './TestScene.scss';

const TestScene: React.FC = () => {
    // Render

    return (
        <div id="test">
            <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                <button className="btn" onClick={() => NotificationService.info('Test Info')}>Notify Info</button>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <button className="btn" onClick={() => NotificationService.error('Test Error Test Error Test Error Test Error Test Error Test Error Test Error Test Error Test Error Test Error')}>Notify Error</button>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <button type="button" className="btn" disabled={true}>
                    Exemplo&nbsp;<i className="fa fa-spinner fa-spin" />
                </button>
            </div>
        </div>
    );
};

export default TestScene;
