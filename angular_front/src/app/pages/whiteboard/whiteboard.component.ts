import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseBoardsService } from '../../services/firebase-boards/firebase-boards.service';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrl: './whiteboard.component.scss'
})
export class WhiteboardComponent {

    workspaceId: string | null = null;
    boardId: string | null = null;

    boardColorBackground: string | null = null;
    boardPictureBackground: string | null = null;


    // options = {
    //     backgroundColor: '#ffffff',
    //     strokeWidth: 2,
    //     strokeColor: '#000000',
    //   };

        currentTool = 'pen'; // Default tool
        isDrawing = false;
        startX = 0;
        startY = 0;
        options = {
            strokeColor: '#000000',
            strokeWidth: 2,
      };

    constructor(
        private route: ActivatedRoute,
        private svBoard: FirebaseBoardsService
    ) { }

    ngOnInit() {
        this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        this.boardId = this.route.snapshot.paramMap.get('boardId');
        if (this.workspaceId && this.boardId)
            this.svBoard.getBoardBackground(this.workspaceId, this.boardId).subscribe(background => {
                this.boardColorBackground = background.color;
                this.boardPictureBackground = background.picture;
        });
    }

      // Tool selection logic
      setTool(tool: string): void {
        this.currentTool = tool;
      }

      // Start drawing
      startDrawing(event: MouseEvent): void {
        if (this.currentTool !== 'square') return;
        this.isDrawing = true;
        const canvas = event.target as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        this.startX = event.clientX - rect.left;
        this.startY = event.clientY - rect.top;
      }

      // Draw square
      draw(event: MouseEvent): void {
        if (!this.isDrawing || this.currentTool !== 'square') return;

        const canvas = event.target as HTMLCanvasElement;
        // const ctx = canvas.getContext('2d');
        // if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;

        const width = currentX - this.startX;
        const height = currentY - this.startY;

        const sideLength = Math.min(Math.abs(width), Math.abs(height));
        const adjustedX = width < 0 ? this.startX - sideLength : this.startX;
        const adjustedY = height < 0 ? this.startY - sideLength : this.startY;

        // // Clear the canvas and redraw
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.strokeStyle = this.options.strokeColor;
        // ctx.lineWidth = this.options.strokeWidth;
        // ctx.strokeRect(adjustedX, adjustedY, sideLength, sideLength);
      }

      // Stop drawing
      stopDrawing(event: MouseEvent): void {
        if (this.currentTool !== 'square') return;
        this.isDrawing = false;
      }

      // Other features
      clearBoard(): void {
        console.log('Board cleared!');
      }

      saveBoard(): void {
      }

      redoAction(): void {
        console.log('Redo action');
      }

      undoAction(): void {
        console.log('Undo action');
      }
}
