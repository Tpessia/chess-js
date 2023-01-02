import { StrictEnumDictionary } from '@/utils';
import { cloneDeep } from 'lodash-es';
import { ChessCoordinate, chessCoordinateToMatrixIndex } from './ChessCoordinate';
import { ChessMove } from './ChessMove';
import { ChessPieceBase, ChessPiecePawn } from './ChessPiece';
import { ChessPieceColor } from './ChessPieceType';
import { ChessSquare } from './ChessSquare';

export type ChessBoardMatrix = ChessSquare[][];
export type ChessBoardMap = StrictEnumDictionary<ChessCoordinate, ChessSquare>;

export class ChessBoard {
    snapshots: ChessBoardMatrix[];
    moves: ChessMove[];

    get boardMatrix() {
        return this.snapshots[this.snapshots.length - 1];
    }

    constructor(chessboard?: ChessBoard) {
        const newBoard = chessboard == null;

        this.snapshots = chessboard?.snapshots ?? [[...Array(8)].map((_, i) => [...Array(8)].map((_, j) => new ChessSquare(i, j)))];
        this.moves = chessboard?.moves ?? [];

        if (newBoard) {
            this.addPiece(new ChessPiecePawn(ChessPieceColor.White), ChessCoordinate.a2);
            this.addPiece(new ChessPiecePawn(ChessPieceColor.White), ChessCoordinate.b2);
            this.addPiece(new ChessPiecePawn(ChessPieceColor.White), ChessCoordinate.c2);
            this.addPiece(new ChessPiecePawn(ChessPieceColor.White), ChessCoordinate.d2);
            this.addPiece(new ChessPiecePawn(ChessPieceColor.White), ChessCoordinate.e2);
            this.addPiece(new ChessPiecePawn(ChessPieceColor.White), ChessCoordinate.f2);
            this.addPiece(new ChessPiecePawn(ChessPieceColor.White), ChessCoordinate.g2);
            this.addPiece(new ChessPiecePawn(ChessPieceColor.White), ChessCoordinate.h2);

            this.addPiece(new ChessPiecePawn(ChessPieceColor.Black), ChessCoordinate.h4);
            this.addPiece(new ChessPiecePawn(ChessPieceColor.White), ChessCoordinate.g4);
        }
    }

    getSquare(coordinate: ChessCoordinate) {
        const [rIndex, cIndex] = chessCoordinateToMatrixIndex(coordinate);
        return this.boardMatrix[rIndex][cIndex];
    }

    addPiece(piece: ChessPieceBase, coordinate: ChessCoordinate) {
        const square = this.getSquare(coordinate);
        square.piece = piece;
    }

    async movePiece(originCoordinate: ChessCoordinate, targetCoordinates: ChessCoordinate[]) {
        this.snapshots.push(cloneDeep(this.boardMatrix));

        const finalCoordinate = targetCoordinates[targetCoordinates.length - 1];
        let prevSquare = this.getSquare(originCoordinate);
        const piece = prevSquare.piece;

        if (piece == null) throw new Error(`Invalid movement, no piece at ${originCoordinate}`);

        // for (let targetCoordinate of targetCoordinates) {
        //     prevSquare.piece = undefined; // TODO: move animation
        //     const targetSquare = this.getSquare(targetCoordinate);
        //     targetSquare.piece = piece;
        //     await sleep(100);
        //     prevSquare = targetSquare;
        // }

        prevSquare.piece = undefined;
        const targetSquare = this.getSquare(finalCoordinate);
        const capture = targetSquare.piece;
        if (capture?.color === piece.color) throw new Error(`Invalid movement, cannot capture pieces of same color at ${finalCoordinate}`);
        targetSquare.piece = piece;

        this.moves.push(new ChessMove(piece, originCoordinate, finalCoordinate, capture));
    }

    async moveFake(coordinate: ChessCoordinate) {
        const square = this.getSquare(coordinate);
        if (square.piece == null) return this;
        const moves = square.piece.getMoves(square.coordinate);
        await this.movePiece(square.coordinate, moves[0]);
        return this;
    }

    toString() {
        return this.boardMatrix.map(e => e.map(f => f.piece?.symbol ?? '.').join(' ')).join('\n');
    }
}