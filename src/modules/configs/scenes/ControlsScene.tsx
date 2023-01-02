import { NotificationService } from '@/services/NotificationService';

const ControlsScene: React.FC = () => {
    // Functions

    const resetData = () => {
        localStorage.clear();
        NotificationService.info('Limpeza Concluída!');
    };

    // Render

    return (
        <div id="controls">
            <div style={{ marginBottom: '10px' }}>
                <button className="btn" onClick={() => resetData()}>Limpar Dados</button>
            </div>
        </div>
    );
};

export default ControlsScene;
