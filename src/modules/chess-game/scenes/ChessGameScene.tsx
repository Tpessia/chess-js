import { ChessBoard } from '@/models/chess/ChessBoard';
import { cloneDeep } from 'lodash-es';
import { useState } from 'react';
import './ChessGameScene.scss';

const ChessGameScene: React.FC = () => {
    // State

    const [board, setBoard] = useState<ChessBoard>(() => new ChessBoard());

    // Render

    return (
        <div id="game">
            <div className="chess-board">
                <div className="chess-grid">
                    {board.boardMatrix.flat().map((e, i) => {
                        return (
                            <span className="chess-square" key={i} onClick={() => cloneDeep(board).moveFake(e.coordinate).then(r => setBoard(r))}>
                                {e.piece?.symbol}
                                {e.numberLabel && <span className="number-label">{e.numberLabel}</span>}
                                {e.letterLabel && <span className="letter-label">{e.letterLabel}</span>}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChessGameScene;
