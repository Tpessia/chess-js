import { sleep, StrictEnumDictionary } from "@/utils";
import { ChessCoordinate, chessCoordinateToMatrixIndex } from "./ChessCoordinate";
import { ChessPieceBase, ChessPiecePawn } from "./ChessPiece";
import { ChessSquare } from "./ChessSquare";

export type ChessBoardMatrix = ChessSquare[][];
export type ChessBoardMap = StrictEnumDictionary<ChessCoordinate, ChessSquare>;

export class ChessBoard {
    boardMatrix: ChessBoardMatrix;

    constructor() {
        this.boardMatrix = [...Array(8)].map((_, i) => [...Array(8)].map((_, j) => new ChessSquare(j, i)))

        this.addPiece(new ChessPiecePawn(), ChessCoordinate.b1);
        this.addPiece(new ChessPiecePawn(), ChessCoordinate.b2);
        this.addPiece(new ChessPiecePawn(), ChessCoordinate.b3);
        this.addPiece(new ChessPiecePawn(), ChessCoordinate.b4);
        this.addPiece(new ChessPiecePawn(), ChessCoordinate.b5);
        this.addPiece(new ChessPiecePawn(), ChessCoordinate.b6);
        this.addPiece(new ChessPiecePawn(), ChessCoordinate.b7);
        this.addPiece(new ChessPiecePawn(), ChessCoordinate.b8);
    }

    getSquare(coordinate: ChessCoordinate) {
        const [cIndex, rIndex] = chessCoordinateToMatrixIndex(coordinate);
        return this.boardMatrix[cIndex][rIndex];
    }

    addPiece(piece: ChessPieceBase, coordinate: ChessCoordinate) {
        const square = this.getSquare(coordinate);
        square.piece = piece;
    }

    async movePiece(originCoordinate: ChessCoordinate, targetCoordinates: ChessCoordinate[]) {
        let prevSquare = this.getSquare(originCoordinate);
        const piece = prevSquare.piece;

        if (piece == null) throw new Error(`Invalid movement, no piece at ${originCoordinate}`);
console.log(this.boardMatrix)
        for (let targetCoordinate of targetCoordinates) {
            prevSquare.piece = undefined; // TODO: move animation
            const targetSquare = this.getSquare(targetCoordinate);
            targetSquare.piece = piece;
            await sleep(100);
        }
console.log(this.boardMatrix)
    }

    async moveFake(coordinate: ChessCoordinate) {
        const square = this.getSquare(ChessCoordinate.b1);
        const moves = square.piece!.getMoves(square.coordinate);
        console.log(square, moves)
        await this.movePiece(ChessCoordinate.b1, moves[0]);
        return this;
    }
}