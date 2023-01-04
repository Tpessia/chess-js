import { ChessBoard } from '@/models/chess/ChessBoard';
import { ChessMove } from '@/models/chess/ChessMove';
import { ChessPieceColor } from '@/models/chess/ChessPieceType';
import { ChessSquare } from '@/models/chess/ChessSquare';
import { exportJson, importJson } from '@/utils';
import useStateUpdate from '@/utils/reactjs/hooks/useUpdateState';
import clsx from 'clsx';
import { cloneDeep } from 'lodash-es';
import React, { useState } from 'react';
import './ChessGameScene.scss';

interface State {
    board: ChessBoard;
    highlight?: {
        origin: ChessSquare,
        targets: ChessMove[],
    },
}

function initState(): State {
    return {
        board: new ChessBoard(ChessPieceColor.White),
        highlight: undefined,
    };
}

const ChessGameScene: React.FC = () => {
    // State

    const [state, setState] = useState<State>(() => initState());
    const updateState = useStateUpdate(setState);

    // Functions

    const highlightMoves = (square: ChessSquare) => {
        const moves = state.board.getMoves(square);
        const highlight = moves != null ? { origin: square, targets: moves } : undefined;
        updateState({ highlight: { $set: highlight } });
    };

    const movePiece = async (move: ChessMove) => {
        const newBoard = cloneDeep(state.board);
        await newBoard.movePiece(move);
        updateState({ board: { $set: newBoard }, highlight: { $set: undefined } });
    };

    const resetBoard = () => {
        updateState({ board: { $set: new ChessBoard(ChessPieceColor.White) } });
    };

    // TODO: import/export
    const exportBoard = () => {
        exportJson(state.board, 'chess-board');
    };

    const importBoard = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e || !e.target || !e.target.files || e.target.files.length === 0) return;

        const chessBoard = await importJson(e.target.files[0]);
        // e.target.value = null;

        updateState({ board: { $set: chessBoard } });
    };

    const chessMoveClass = (move: ChessMove) => clsx('chess-move', `chess-move-${move.piece.color.toLocaleLowerCase()}`);

    const chessSquareClass = (square: ChessSquare, isHighlight: boolean) => clsx('chess-square', square.piece?.color && `piece-${square.piece?.color?.toLocaleLowerCase()}`, { 'has-piece': !!square.piece }, { 'is-highlight': isHighlight });

    // Components

    const movesComponent = state.board.moves.map((e, i, arr) => (
        <div key={i} className={chessMoveClass(e)}>
            <span className="chess-move-color">{`[${e.piece.color[0]}]`}</span>
            <span className="chess-move-number">{arr.length - i}.</span>&nbsp;
            <span className="chess-move-notation">{e.toString()}</span>
        </div>
    ));

    // Render

    return (
        <div id="chess-game">
            <div className="chess-info">
                <div>
                    Playing: {state.board.playingColor}
                </div>
                <div>
                    <button type="button" className="btn" onClick={resetBoard}>Reset</button>
                </div>
                {/* <div>
                    <button type="button" className="btn" onClick={exportBoard}>Export</button>
                </div>
                <div>
                    <input type="file" id="import" onChange={importBoard} />
                </div> */}
            </div>
            <div className="chess-board">
                <div className="chess-grid">
                    {state.board.boardMatrix.flat().map((e, i) => {
                        const moveHighlight = state.highlight?.targets.find(f => e.coordinate === f.targetCoordinate);
                        const onClick = () => moveHighlight ? movePiece(moveHighlight) : highlightMoves(e);

                        return (
                            <span key={i} className={chessSquareClass(e, !!moveHighlight)} onClick={onClick}>
                                {e.piece?.symbol}
                                {e.numberLabel && <span className="number-label">{e.numberLabel}</span>}
                                {e.letterLabel && <span className="letter-label">{e.letterLabel}</span>}
                            </span>
                        );
                    })}
                </div>
            </div>
            <div className="chess-moves">
                {movesComponent}
            </div>
        </div>
    );
};

export default ChessGameScene;
