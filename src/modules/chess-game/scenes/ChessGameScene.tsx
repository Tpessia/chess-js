import { ChessBoard } from '@/models/chess/ChessBoard';
import { ChessMove } from '@/models/chess/ChessMove';
import { ChessPieceColor } from '@/models/chess/ChessPieceType';
import { ChessSquare } from '@/models/chess/ChessSquare';
import { exportJson, importJson } from '@/utils';
import useLazyRef from '@/utils/reactjs/hooks/useLazyRef';
import useStateUpdate from '@/utils/reactjs/hooks/useUpdateState';
import clsx from 'clsx';
import React, { useState } from 'react';
import './ChessGameScene.scss';

interface State {
    chessBoardVersion: number,
    highlight?: {
        origin: ChessSquare,
        targets: ChessMove[],
    },
}

function initState(): State {
    return {
        chessBoardVersion: 0,
        highlight: undefined,
    };
}

const ChessGameScene: React.FC = () => {
    // State
    
    const [state, setState] = useState<State>(() => initState());
    const updateState = useStateUpdate(setState);
    
    const chessBoardRef = useLazyRef<ChessBoard>(() => new ChessBoard(ChessPieceColor.White));
    const chessBoard = chessBoardRef.current;

    // Functions

    const refreshChessBoard = (newChessBoard?: ChessBoard) => {
        if (newChessBoard != null) chessBoardRef.current = newChessBoard;
        updateState({ chessBoardVersion: { $set: state.chessBoardVersion + 1 }, highlight: { $set: undefined } });
    };

    const highlightMoves = (square: ChessSquare) => {
        const moves = chessBoard.getMoves(square);
        const highlight = moves != null ? { origin: square, targets: moves } : undefined;
        updateState({ highlight: { $set: highlight } });
    };

    const movePiece = async (move: ChessMove) => {
        chessBoard.movePiece(move);
        refreshChessBoard();
    };

    const undoMove = async () => {
        chessBoard.undoMove();
        refreshChessBoard();
    };

    const redoMove = async () => {
        chessBoard.redoMove();
        refreshChessBoard();
    };

    const resetBoard = () => {
        refreshChessBoard(new ChessBoard(chessBoard.playerColor));
    };

    // TODO: import/export
    const exportBoard = () => {
        exportJson(chessBoard, 'chess-board');
    };

    const importBoard = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e || !e.target || !e.target.files || e.target.files.length === 0) return;

        const newChessBoard = await importJson(e.target.files[0]);
        // e.target.value = null;

        refreshChessBoard(newChessBoard);
    };

    const chessMoveClass = (move: ChessMove) => clsx('chess-move', `chess-move-${move.piece.color.toLocaleLowerCase()}`);

    const chessSquareClass = (square: ChessSquare, isHighlight: boolean) => clsx('chess-square', square.piece?.color && `piece-${square.piece?.color?.toLocaleLowerCase()}`, { 'has-piece': !!square.piece }, { 'is-highlight': isHighlight });

    // Components

    const movesComponent = chessBoard.moves().slice().reverse().map((e, i, arr) => ( // TODO: improve linq
        <div key={i} className={chessMoveClass(e)}>
            <span className="chess-move-color">{`[${e.piece.color[0]}]`}</span>
            <span className="chess-move-number">{arr.length - i}.</span>&nbsp;
            <span className="chess-move-notation">{e.toString()}</span>
        </div>
    ));

    // Render

    return (
        <div id="chess-game">
            <div className="chess-board">
                <div className="chess-grid">
                    {chessBoard.boardView.flat().map((e, i) => {
                        const moveHighlight = state.highlight?.targets.find(f => e.coordinate.code === f.targetCoordinate.code);
                        const onClick = () => moveHighlight ? movePiece(moveHighlight) : highlightMoves(e);

                        return (
                            <span key={i} className={chessSquareClass(e, !!moveHighlight)} onClick={onClick}>
                                {e.piece?.symbol}
                                {<span className="number-label">{e.numberLabel}</span>}
                                {<span className="letter-label">{e.letterLabel}</span>}
                            </span>
                        );
                    })}
                </div>
            </div>
            <div className="chess-dashboard">
                <div className="chess-info">
                    {/* <span>Player: {chessBoard.playerColor}</span> */}
                    <span>Playing: {chessBoard.board.playingColor}</span>
                </div>
                <div className="chess-controls">
                    <button type="button" className="btn" onClick={resetBoard}>Reset</button>
                    <button type="button" className="btn" onClick={undoMove} disabled={!chessBoard.canUndoMove}>Undo</button>
                    <button type="button" className="btn" onClick={redoMove} disabled={!chessBoard.canRedoMove}>Redo</button>
                    {/* <button type="button" className="btn" onClick={exportBoard}>Export</button>
                    <input type="file" id="import" onChange={importBoard} /> */}
                </div>
                <div className="chess-moves">
                    {movesComponent}
                </div>
            </div>
        </div>
    );
};

export default ChessGameScene;
