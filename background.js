const canvas = document.getElementById("bgCanvas");

const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

class Particle {

    constructor() {

        this.reset();

        this.x = Math.random() * canvas.width;

        this.y = Math.random() * canvas.height;

    }

    reset() {

        this.x = Math.random() * canvas.width;

        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 3 + 2;

        this.speedX = (Math.random() - 0.5) * 0.8;

        this.speedY = (Math.random() - 0.5) * 0.8;

    }

    update() {

        this.x += this.speedX;

        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {

            this.speedX *= -1;

        }

        if (this.y < 0 || this.y > canvas.height) {

            this.speedY *= -1;

        }

    }

    draw() {

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        ctx.fillStyle = "#49f2d4";

        ctx.shadowBlur = 15;

        ctx.shadowColor = "#49f2d4";

        ctx.fill();

        ctx.shadowBlur = 0;

    }

}

for (let i = 0; i < 70; i++) {

    particles.push(new Particle());

}

function drawConnections() {

    for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

            let dx = particles[i].x - particles[j].x;

            let dy = particles[i].y - particles[j].y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 180) {

                ctx.beginPath();

                ctx.moveTo(

                    particles[i].x,

                    particles[i].y

                );

                ctx.lineTo(

                    particles[j].x,

                    particles[j].y

                );

                ctx.strokeStyle =

                    "rgba(90,255,225," +

                    (1 - distance / 180) * 0.35 +

                    ")";

                ctx.lineWidth = 1.2;

                ctx.stroke();

            }

        }

    }

}

function drawTriangles() {

    for (let i = 0; i < particles.length - 2; i += 3) {

        const p1 = particles[i];

        const p2 = particles[i + 1];

        const p3 = particles[i + 2];

        ctx.beginPath();

        ctx.moveTo(p1.x, p1.y);

        ctx.lineTo(p2.x, p2.y);

        ctx.lineTo(p3.x, p3.y);

        ctx.closePath();

        ctx.fillStyle = "rgba(65,235,210,0.08)";

        ctx.fill();

    }

}

function animate() {

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

    particles.forEach(function (particle) {

        particle.update();

    });

    drawTriangles();

    drawConnections();

    particles.forEach(function (particle) {

        particle.draw();

    });

    requestAnimationFrame(animate);

}

animate();

let mouse = {

    x: null,

    y: null

};

window.addEventListener("mousemove", function (e) {

    mouse.x = e.clientX;

    mouse.y = e.clientY;

    particles.forEach(function (particle) {

        let dx = mouse.x - particle.x;

        let dy = mouse.y - particle.y;

        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {

            particle.x -= dx * 0.015;

            particle.y -= dy * 0.015;

        }

    });

});