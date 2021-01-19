# BrickWall

My lightweight, vanilla javascript take on a "Masonry" layout.  No dependencies.  Less than 150 lines of code. Less than 4KB (before minification/compression!).


## About

After trying several libraries/approaches that attempt to create the infamous masonry layout, I thought it could be accomplished with a bit more simplicity.  Unfortunately, Pure-CSS approaches were neither "easy" nor seemed to correctly render a row-first layout with various height elements.  

My approach is to extract all of the original elements ("bricks") from the "wall", insert the correct number of "columns" into the wall, and re-distribute the original "bricks" into columns in-order using the shortest column.

An unfortunate consequence of using Flexbox is that there isn't a great way to configure the number of columns through CSS media queries, but in practice it's pretty easy to just configure the breakpoint-to-number-of-column mappings for the instance in JavaScript.  An advantage here is that the breakpoints can easily be changed dynamically by just updating the options and invoking `layout()`. 

From a performance perspective, I have not captured any real benchmarks but it passes the 'feels fast' test to me.  

I (at least initially) don't intend to support this as a distributable component - it's more a proof of how simple this can be 

## Usage

HTML
```
<div class="brick-wall" id="brick-wall">
    <div class="brick">
        <!-- include the width and height attributes to get correct layout before images load -->
        <img src="..." width="x" height="y" />
    </div>
</div>
```

CSS
```
.brick-wall {
    display: flex;
}

.brick-wall-column {
    flex: 1;
    width: 100%;
}

.brick {
    margin: 0 5px 10px 5px;
}

.brick img {    
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
    background-color: #ccc;
}
```

JavaScript
```
let brickwall = new BrickWall(document.getElementById("brick-wall")).init();
```

## Options

The BrickWall constructor takes an optional options object as its 2nd parameter. 

```
new BrickWall(wallElement, {
    defaultHeight: 400,
    breakPoints: {
        0: 1,
        320: 2,
        768: 3,
        1024: 4,
        1200: 5
    }
});
```

## Events

The events `brick-wall-layout-started` and `brick-wall-layout-completed` are fired around the layout process on the wallElement, and can be used to add behavior before or after the layout is refreshed.  You can register listeners directly on the wallElement, or use the convienice method `addEventListener(...)` on the BrickWall instance (it does the same thing).  

Note - the first layout occurs at the end of `init()`, so register listeners first.

```
let brickwall = new BrickWall(wallElement);

brickwall.addEventListener('brick-wall-layout-completed' () => {
    console.log("Layout complete.");
});

brickwall.init();
```
