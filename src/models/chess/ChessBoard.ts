import { EnumDictionary, StrictEnumDictionary } from '@/utils';
import { cloneDeep } from 'lodash-es';
import { ChessCoordinate, chessCoordinateFromMatrix, chessCoordinateToMatrix } from './ChessCoordinate';
import { ChessMove } from './ChessMove';
import { ChessPieceBase, ChessPieceBishop, ChessPieceKing, ChessPieceKnight, ChessPiecePawn, ChessPieceQueen, ChessPieceRook } from './ChessPiece';
import { ChessPieceColor } from './ChessPieceType';
import { ChessSquare } from './ChessSquare';

export type ChessBoardMatrix = ChessSquare[][];
export type ChessBoardMap = StrictEnumDictionary<ChessCoordinate, ChessSquare>;

export class ChessBoard {
    initColor: ChessPieceColor;
    snapshots: ChessBoardMatrix[];
    moves: ChessMove[];

    playerColor: ChessPieceColor;
    playingColor: ChessPieceColor;

    get boardMatrix() {
        return this.snapshots[this.snapshots.length - 1];
    }

    constructor(playerColor: ChessPieceColor, chessBoard?: ChessBoard) {
        this.initColor = chessBoard?.initColor ?? ChessPieceColor.White;
        this.snapshots = chessBoard?.snapshots ?? [initBoard(this.initColor)];
        this.moves = chessBoard?.moves ?? [];
        this.playerColor = playerColor;
        this.playingColor = chessBoard?.playingColor ?? ChessPieceColor.White;
    }

    // Squares

    getSquare(coord: ChessCoordinate) {
        const { rowIndex, colIndex } = chessCoordinateToMatrix(coord);
        return this.boardMatrix[rowIndex][colIndex];
    }

    // Pieces

    addPiece(piece: ChessPieceBase, coord: ChessCoordinate) {
        const square = this.getSquare(coord);
        square.piece = piece;
    }

    // Moves

    getMoves(square: ChessSquare) {
        if (square.piece == null) return;
        if (square.piece.color !== this.playingColor) return;
        let moves = square.piece.getMoves(square.coordinate, this);
        return moves;
    }

    async movePiece(move: ChessMove) {
        // TODO: move sideEffects

        this.snapshots.push(cloneDeep(this.boardMatrix));

        const square = this.getSquare(move.originCoordinate);
        const piece = square.piece;

        if (piece == null) throw new Error(`Invalid movement, no piece at ${square.coordinate}`);
        if (piece.color !== this.playingColor) throw new Error(`Invalid movement, wrong piece color: ${piece.color}`);

        const targetSquare = this.getSquare(move.targetCoordinate);
        const capture = targetSquare.piece;

        if (capture?.color === piece.color) throw new Error(`Invalid movement, cannot capture pieces of same color at ${move.targetCoordinate}`);

        square.piece = undefined;
        targetSquare.piece = piece;

        this.playingColor = this.playingColor === ChessPieceColor.White ? ChessPieceColor.Black : ChessPieceColor.White;

        // HISTORY

        // TODO: improve recreation?
        move = new ChessMove(piece, move.originCoordinate, move.targetCoordinate, capture, move.sideEffects);

        this.pushMove(move);
    }

    pushMove(move: ChessMove) {
        this.moves.unshift(move);
        move.piece.moves.unshift(move);
    }

    // Utils

    toString() {
        return this.boardMatrix.map(e => e.map(f => f.piece?.symbol ?? '.').join(' ')).join('\n');
    }
}

function initBoard(initColor: ChessPieceColor) {
    const whitePiecesMatrix: EnumDictionary<ChessCoordinate, ChessPieceBase> = { [ChessCoordinate.a1]: new ChessPieceRook(ChessPieceColor.Black), [ChessCoordinate.b1]: new ChessPieceKnight(ChessPieceColor.Black), [ChessCoordinate.c1]: new ChessPieceBishop(ChessPieceColor.Black), [ChessCoordinate.d1]: new ChessPieceKing(ChessPieceColor.Black), [ChessCoordinate.e1]: new ChessPieceQueen(ChessPieceColor.Black), [ChessCoordinate.f1]: new ChessPieceBishop(ChessPieceColor.Black), [ChessCoordinate.g1]: new ChessPieceKnight(ChessPieceColor.Black), [ChessCoordinate.h1]: new ChessPieceRook(ChessPieceColor.Black), [ChessCoordinate.a2]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.b2]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.c2]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.d2]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.e2]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.f2]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.g2]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.h2]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.a8]: new ChessPieceRook(ChessPieceColor.White), [ChessCoordinate.b8]: new ChessPieceKnight(ChessPieceColor.White), [ChessCoordinate.c8]: new ChessPieceBishop(ChessPieceColor.White), [ChessCoordinate.d8]: new ChessPieceKing(ChessPieceColor.White), [ChessCoordinate.e8]: new ChessPieceQueen(ChessPieceColor.White), [ChessCoordinate.f8]: new ChessPieceBishop(ChessPieceColor.White), [ChessCoordinate.g8]: new ChessPieceKnight(ChessPieceColor.White), [ChessCoordinate.h8]: new ChessPieceRook(ChessPieceColor.White), [ChessCoordinate.a7]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.b7]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.c7]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.d7]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.e7]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.f7]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.g7]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.h7]: new ChessPiecePawn(ChessPieceColor.White) };
    const blackPiecesMatrix: EnumDictionary<ChessCoordinate, ChessPieceBase> = { [ChessCoordinate.a1]: new ChessPieceRook(ChessPieceColor.White), [ChessCoordinate.b1]: new ChessPieceKnight(ChessPieceColor.White), [ChessCoordinate.c1]: new ChessPieceBishop(ChessPieceColor.White), [ChessCoordinate.d1]: new ChessPieceKing(ChessPieceColor.White), [ChessCoordinate.e1]: new ChessPieceQueen(ChessPieceColor.White), [ChessCoordinate.f1]: new ChessPieceBishop(ChessPieceColor.White), [ChessCoordinate.g1]: new ChessPieceKnight(ChessPieceColor.White), [ChessCoordinate.h1]: new ChessPieceRook(ChessPieceColor.White), [ChessCoordinate.a2]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.b2]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.c2]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.d2]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.e2]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.f2]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.g2]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.h2]: new ChessPiecePawn(ChessPieceColor.White), [ChessCoordinate.a8]: new ChessPieceRook(ChessPieceColor.Black), [ChessCoordinate.b8]: new ChessPieceKnight(ChessPieceColor.Black), [ChessCoordinate.c8]: new ChessPieceBishop(ChessPieceColor.Black), [ChessCoordinate.d8]: new ChessPieceKing(ChessPieceColor.Black), [ChessCoordinate.e8]: new ChessPieceQueen(ChessPieceColor.Black), [ChessCoordinate.f8]: new ChessPieceBishop(ChessPieceColor.Black), [ChessCoordinate.g8]: new ChessPieceKnight(ChessPieceColor.Black), [ChessCoordinate.h8]: new ChessPieceRook(ChessPieceColor.Black), [ChessCoordinate.a7]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.b7]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.c7]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.d7]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.e7]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.f7]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.g7]: new ChessPiecePawn(ChessPieceColor.Black), [ChessCoordinate.h7]: new ChessPiecePawn(ChessPieceColor.Black) };

    const piecesMatrix = initColor === ChessPieceColor.White ? whitePiecesMatrix : blackPiecesMatrix;

    const boardMatrix: ChessBoardMatrix = [...Array(8)].map((_, i) => [...Array(8)].map((_, j) => new ChessSquare(i, j, piecesMatrix[chessCoordinateFromMatrix(i, j, true)!.coordinate])));

    return boardMatrix;
}
