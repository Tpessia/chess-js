import { ChessBoard } from '@/models/chess/ChessBoard';
import { ChessBot } from '@/models/chess/ChessBot';
import { ChessMove } from '@/models/chess/ChessMove';
import { ChessPieceColor, reverseChessPieceColor } from '@/models/chess/ChessPieceType';
import { ChessSquare } from '@/models/chess/ChessSquare';
import useLazyRef from '@/utils/reactjs/hooks/useLazyRef';
import useStateUpdate from '@/utils/reactjs/hooks/useUpdateState';
import clsx from 'clsx';
import React, { useState } from 'react';
import './ChessGameScene.scss';

interface State {
    chessBoardVersion: number,
    enableBot: boolean,
    highlight?: {
        origin: ChessSquare,
        targets: ChessMove[],
    },
}

function initState(): State {
    return {
        chessBoardVersion: 0,
        enableBot: true,
        highlight: undefined,
    };
}

const ChessGameScene: React.FC = () => {
    // State
    
    const [state, setState] = useState<State>(() => initState());
    const updateState = useStateUpdate(setState);
    
    const chessBoardRef = useLazyRef<ChessBoard>(() => new ChessBoard(ChessPieceColor.White));
    const chessBoard = chessBoardRef.current;

    const chessBot = new ChessBot(chessBoard);

    // Functions

    const refreshChessBoard = (newChessBoard?: ChessBoard) => {
        if (newChessBoard != null) chessBoardRef.current = newChessBoard;
        updateState(s => ({ chessBoardVersion: { $set: s.chessBoardVersion + 1 }, highlight: { $set: undefined } }));
    };

    const highlightMoves = (square: ChessSquare) => {
        if (state.enableBot && square.piece?.color != chessBoard.playerColor) return;
        const moves = chessBoard.getMoves(square);
        const highlight = moves != null ? { origin: square, targets: moves } : undefined;
        updateState({ highlight: { $set: highlight } });
    };

    const movePiece = (move: ChessMove) => {
        chessBoard.movePiece(move);
        refreshChessBoard();

        if (state.enableBot) setTimeout(() => moveBotPiece(), 200);
    };

    const moveBotPiece = () => {
        chessBot.move();
        refreshChessBoard();
    };

    const undoMove = () => {
        chessBoard.undoMove();
        refreshChessBoard();
    };

    const redoMove = () => {
        chessBoard.redoMove();
        refreshChessBoard();
    };

    const resetBoard = () => {
        refreshChessBoard(new ChessBoard(chessBoard.playerColor));
    };

    // TODO: import/export, https://github.com/typestack/class-transformer
    // const exportBoard = () => {
    //     exportJson(chessBoard, 'chess-board');
    // };

    // const importBoard = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (!e || !e.target || !e.target.files || e.target.files.length === 0) return;

    //     const newChessBoard = await importJson(e.target.files[0]);

    //     refreshChessBoard(newChessBoard);
    // };

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
                        const winnerColor = chessBoard.winner ? reverseChessPieceColor(chessBoard.winner) : null;
                        const onClick = () => moveHighlight ? movePiece(moveHighlight) : highlightMoves(e);

                        return (
                            <span key={i} className={chessSquareClass(e, !!moveHighlight)} onClick={onClick}>
                                {winnerColor === e.piece?.color ? <b>{e.piece?.symbol}</b> : e.piece?.symbol}
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
                    <div style={{ marginBottom: '10px' }}>Playing: {chessBoard.board.playingColor}</div>
                    <div style={{ cursor: 'pointer' }} onClick={() => updateState(s => ({ enableBot: { $set: !s.enableBot } }))}>
                        {state.enableBot ? <span>Human vs Bot</span> : <span>Human vs Human</span>}
                        <span style={{ marginLeft: '5px' }}>&#8645;</span>
                    </div>
                </div>
                <div className="chess-controls">
                    <button type="button" className="chess-control-btn btn" onClick={resetBoard}>Reset</button>
                    <button type="button" className="chess-control-btn btn" onClick={undoMove} disabled={!chessBoard.canUndoMove}>Undo</button>
                    <button type="button" className="chess-control-btn btn" onClick={redoMove} disabled={!chessBoard.canRedoMove}>Redo</button>
                    {/* <button type="button" className="chess-control-btn btn" onClick={exportBoard}>Export</button>
                    <label className="chess-control-btn chess-import btn">
                        <input type="file" onChange={importBoard} />
                        Import
                    </label> */}
                </div>
                <div className="chess-moves">
                    {movesComponent}
                </div>
            </div>
        </div>
    );
};

export default ChessGameScene;
