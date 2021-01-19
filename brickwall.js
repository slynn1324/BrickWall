function BrickWall(wallElement, options){

    this.options = options;

    if ( !this.options ){
        this.options = {};
    }
    if ( !this.options.defaultHeight ){
        this.options.defaultHeight = 400;
    }
    if ( !this.options.breakPoints ){
        this.options.breakPoints = {
            0: 1,
            320: 2,
            768: 3,
            1024: 4,
            1200: 5
        };
    }

    this.wall = wallElement;
    this.bricks = [];
    this.columnCount = 0;

    this.layout = function(force = false){

        let newColumnCount = 1;
        let wallWidth = this.wall.offsetWidth;
        let maxBreakPoint = -1;

        for ( prop in this.options.breakPoints ){
            let breakPoint = parseInt(prop);
            if ( wallWidth > breakPoint && breakPoint > maxBreakPoint ){
                maxBreakPoint = breakPoint;
                newColumnCount = this.options.breakPoints[prop];
            }
        }

        if ( force || newColumnCount != this.columnCount ){

            this.wall.dispatchEvent(new Event("brick-wall-layout-started"));

            this.columnCount = newColumnCount;

            // reset and draw the columns
            this.wall.innerHTML = "";
            let columns = [];
            let columnHeights = [];

            // create the column elements
            for ( let i = 0; i < this.columnCount; ++i ){
                columnHeights[i] = 0;

                let c = document.createElement("div");
                c.classList.add("brick-wall-column");

                this.wall.appendChild(c);
                columns[i] = c;
            }

            for ( let i = 0; i < this.bricks.length; ++i ){

                let shortestColumnIndex = columnHeights.indexOf(Math.min.apply(null, columnHeights));
                columns[shortestColumnIndex].appendChild(this.bricks[i]);

                let brickHeight = this.bricks[i].offsetHeight || this.options.defaultHeight;
                
                columnHeights[shortestColumnIndex] = columnHeights[shortestColumnIndex] + brickHeight;                
            }

            this.wall.dispatchEvent(new Event('brick-wall-layout-completed'));
        }
    }

    this.init = function(){

        let elements = this.wall.children;

        // make a static copy of the wall children
        for ( let i = 0; i < elements.length; ++i ){
            this.bricks.push(elements[i]);
        }

        // remove all of the elements from the wall, we'll add them back during 'layout'
        for ( let i = 0; i < this.bricks.length; ++i ){
            this.bricks[i].remove();
        }

        window.addEventListener('resize', () => {
            this.layout();
        });
    
        this.layout();

        return this;
    }

    this.addEventListener = function(type, handler){
        this.wall.addEventListener(type, handler);
    }

    this.addBrick = function(element, layout = true){
        this.bricks.push(element);
        if ( layout ){
            this.layout(true);
        }
    }

    this.addBricks = function(elements){
        for ( let i = 0; i < elements.length; ++i ){
            this.addBrick(elements[i], false);
        }
        this.layout(true);
    }

    this.removeBrick = function(element, layout = true){
        let index = this.bricks.indexOf(element);
        this.bricks.splice(index, 1);
        if ( layout ){
            this.layout(true);
        }
    }

    this.removeBricks = function(elements){
        for ( let i = 0; i < elements.length; ++i ){
            this.removeBrick(elements[i], false);
        }
        this.layout(true);
    }

    this.clear = function(element){
        this.bricks = [];
        this.layout(true);
    }
}