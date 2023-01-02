import { ChessBoard } from '@/models/chess/ChessBoard';
import clsx from 'clsx';
import { cloneDeep } from 'lodash-es';
import { useState } from 'react';
import './ChessGameScene.scss';

const ChessGameScene: React.FC = () => {
    // State

    const [board, setBoard] = useState<ChessBoard>(() => new ChessBoard());
console.log('board',board)
console.log(board.toString())
    // Render

    return (
        <div id="game">
            <div className="chess-board">
                <div className="chess-grid">
                    {board.boardMatrix.flat().map((e, i) => {
                        return (
                            <span className={clsx('chess-square', e.piece?.color && `piece-${e.piece?.color?.toLocaleLowerCase()}`, { 'active': !!e.piece })} key={i} onClick={() => cloneDeep(board).moveFake(e.coordinate).then(r => setBoard(r))}>
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
