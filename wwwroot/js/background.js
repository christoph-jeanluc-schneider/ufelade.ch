const vw = Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
const vh = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );

var particles = [];
const particle_count = Math.floor( vw * vh / 1800 );
const K = 80;

var uploading = false;

function setup() {
    createCanvas( vw, vh );
    frameRate( 60 );

    for( let i = 0; i < particle_count; i++ ) {
        particles.push(
            new Particle(
                Math.random() * vw,
                Math.random() * vh )
        );
    }
}

function draw() {
    if( uploading )
        background( 0, 180 );
    else
        background( 0, 60 );

    for( let i in particles )
        particles[ i ].draw();
}

class Particle {
    constructor( x, y ) {
        this.pos = createVector( x, y );
        this.speed = Math.random() * K;
        this.size = K - this.speed;
    }

    draw() {
        if( uploading )
            this.pos.y -= this.size;
        else
            this.pos.y -= this.size / K;

        if( this.pos.y < 0 ) this.pos.y = vh;

        noFill();
        stroke( 255 );
        strokeWeight( 1 );
        if( uploading )
            line( this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.size );
        else
            line( this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.size / K * 10 );
    }
}
