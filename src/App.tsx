import { GlobalContext, GlobalContextState, initGlobalContext } from '@/contexts/GlobalContext';
import ControlsScene from '@/modules/configs/scenes/ControlsScene';
import NotificationsScene from '@/modules/configs/scenes/NotificationsHistScene';
import TestScene from '@/modules/configs/scenes/TestScene';
import GameScene from '@/modules/chess-game/scenes/ChessGameScene';
import LayoutComponent from '@/modules/layout/components/LayoutComponent';
import useEffectAsync from '@/utils/reactjs/hooks/useEffectAsync';
import React, { useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  // State

  const [global, setGlobal] = useState<GlobalContextState>(initGlobalContext());

  // Effects

  useEffectAsync(async () => {
    document.body.style.display = 'block';
  }, []);

  // Render

  return (
    <GlobalContext.Provider value={[global, setGlobal]}>
      <Router basename={process.env.NODE_ENV === 'development' ? '/' : '/chess-js'}>
        <LayoutComponent>
          <Routes>
            <Route path="/" element={<GameScene />} />
            <Route path="/configs/test" element={<TestScene />} />
            <Route path="/configs/controls" element={<ControlsScene />} />
            <Route path="/configs/notifications" element={<NotificationsScene />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LayoutComponent>
      </Router>
    </GlobalContext.Provider>
  );
};

export default App;
