ArrayList<Enemy> enems;
Player player;
ArrayList<Point> points;
int width = 900;
int height = 860;
int w = 48;
int w2 = w/2;
PImage img_lives = loadImage("img/lives.png");

float time;
boolean muted;
boolean loosed;

void setup() {
  loosed = false;
  muted = false;
  frameRate(32);

  size(width, height);
  noStroke(); 
  smooth();
  
  time = 0;
  player = new Player();
  enems = new ArrayList();
  points = new ArrayList();
}

void draw(){
  background(230);
  time += 0.0003;
  if(time > 1) time = 1;
  
  sound("sound_background", 0.20+(time/5));
  
  // Le joueur
  player.move();
  player.display();
  
  Position pp = player.getPos();
  // les enemies
  boolean gone = false;
  for(int i=0;i<enems.size();i++){
    Enemy e = enems.get(i);
    Position ep = e.getPos();
    if(pp.getX()-w2 < ep.getX()+w2 && ep.getX()-w2 < pp.getX()+w2 && pp.getY()-w2 < ep.getY()+w2 && ep.getY()-w2 < pp.getY()+w2){
      player.hit();
    }
    gone = gone || e.move();
    e.display();
  }
  if(gone) player.hit();
  
  // les collectables
  stroke(134, 96, 15);
  fill(255, 192, 0);
  for(int i=0;i<points.size();i++){
    Point p = points.get(i);
    Position ep = p.getPos();
    if(dist(pp.getX(), pp.getY(), ep.getX(), ep.getY()) < w2)
      player.collect(p);
    p.display();
  }
  noStroke();
  
  // le score
  fill(0);
  textSize(20);
  textAlign(RIGHT, TOP);
  text(player.getScore(), width-10, 10);
  
  // les vies restantes
  for(int i=1;i<player.getLives();i++){
    image(img_lives, 20*i, 10);
  }
  
  if(rand(0, 23) == 0){
    enems.add(new Enemy(rand(w2, 900-w2), -w2, rand(2, 4)));
  }
}
void mousePressed(){
  player.shoot(true);
}
void mouseReleased(){
  player.shoot(false);
}
void keyPressed(){
  if(key == DELETE){
    if(muted) muted = false;
    else muted = true;
  }
  else if(key == ENTER && loosed){
    setup();
    loop();
  }
}
int rand(int from, int to){
  return round(random(from, to));
}

void loose(){
  muted = true;
  loosed = true;
  sound("sound_background", 0);
  fill(250, 40, 40);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Score final : "+player.getScore(), width/2, height/2);
  noLoop();
}

/**************** PLAYER ****************/
class Player{
  private Position pos;
  private ArrayList<Bullet> bullets = new ArrayList();
  private PImage img_ship = loadImage("img/ship.png");
  private PImage img_explode = loadImage("img/ship_explode.png");
  private boolean shooting = false;
  private int reload = 0;
  private int lives = 3;
  private int score = 0;
  private int vit = 10;
  private int aie = 0;
  
  public Player(){
    this.pos = new Position(mouseX, mouseY);
  }
  
  public void display(){
    if(this.aie > 0){
      image(this.img_explode, this.pos.getX()-w2, this.pos.getY()-w2);
      this.aie--;
    }
    else image(this.img_ship, this.pos.getX()-w2, this.pos.getY()-w2);
    
    if(this.shooting && this.reload <= 0){
      this.reload = 8;
      sound("sound_fire", 1);
      this.bullets.add(new Bullet(this.pos.getX(), this.pos.getY(), true));
    }
    else{
      this.reload--;
    }
    
    fill(96, 185, 255);
    for(int i=0;i<this.bullets.size();i++){
      Bullet b = this.bullets.get(i);
      b.move();
      b.display();
    }
  }
  
  public void collect(Point pnt){
    sound("sound_bonus", 1);
    this.score += pnt.getRadius();
    points.remove(pnt);
  }
  
  public ArrayList getBullets(){
    return this.bullets;
  }
  public Position getPos(){
    return this.pos;
  }
  public int getScore(){
    return this.score;
  }
  public void addScore(int x){
    this.score += x;
  }
  public int getLives(){
    return this.lives;
  }
  public void hit(){
    sound("sound_explode", 1);
    this.aie = 12;
    if(--this.lives <= 0) loose();
    else enems = new ArrayList();
  }
  
  public void move(){
    this.pos.setXTo(mouseX);
    this.pos.setYTo(mouseY);
  }
  
  public void shoot(boolean act){
    this.shooting = act;
  }
}

/**************** ENEMY ****************/
class Enemy{
  private Position pos;
  private PImage img = loadImage("img/ship.png");
  private ArrayList<Bullet> bullets = new ArrayList();
  private int vit;
  
  public Enemy(int x, int y, int v){
    this.img = loadImage("img/ennemy"+rand(1, 3)+".png");
    this.pos = new Position(x, y);
    this.vit = v;
  }
  
  public void display(){
    image(this.img, this.pos.getX()-w2, this.pos.getY()-w2);
    
    Position pp = player.getPos();
    fill(197, 69, 69);
    for(int i=0;i<this.bullets.size();i++){
      Bullet b = this.bullets.get(i);
      Position bp = b.getPos();
      if(pp.getX()-w2 < bp.getX() && bp.getX() < pp.getX()+w2 && pp.getY()-w2 < bp.getY() && bp.getY() < pp.getY()+w2)
        player.hit();
      b.move();
      b.display();
    }
    this.collide();
  }
  
  public Position getPos(){
    return this.pos;
  }
  public void collide(){
    ArrayList<Bullet> bul = player.getBullets();
    for(int i=0;i<bul.size();i++){
      Bullet b = bul.get(i);
      Position p = b.getPos();
      if(this.pos.getX()-w2 < p.getX() && p.getX() < this.pos.getX()+w2 && this.pos.getY()-w2 < p.getY() && p.getY() < this.pos.getY()+w2){
        player.getBullets().remove(b);
        this.hit();
      }
    }
  }
  public void hit(){
    for(int i=0;i<this.bullets.size();i++){
      points.add(new Point(this.bullets.get(i).getPos(), 5));
    }
    int spr = 15;
    for(int i=0;i<3;i++){
      points.add(new Point(this.pos.getX()+rand(-spr,spr), this.pos.getY()+rand(-spr,spr), 10));
    }
    enems.remove(this);
  }
  
  public boolean move(){
    this.pos.setY(round(this.vit+(5*time)));
    if(rand(0, 42) == 0){
      this.shoot();
    }
    if(height < this.pos.getY()) return true;
    else return false;
  }
  
  public void shoot(){
    this.bullets.add(new Bullet(this.pos.getX(), this.pos.getY(), false));
  }
}

/**************** POINTS ****************/
class Point{
  private Position pos;
  private int radius;
  
  public Point(int x, int y, int r){
    this.pos = new Position(x, y);
    this.radius = r;
  }
  public Point(Position p, int r){
    this.pos = new Position(p.getX(), p.getY());
    this.radius = r;
  }
  
  public Position getPos(){
    return this.pos;
  }
  public int getRadius(){
    return this.radius;
  }
  
  public void display(){
    ellipse(this.pos.getX(), this.pos.getY(), this.radius, this.radius);
  }
}

/**************** BULLET ****************/
class Bullet{
  private Position pos;
  private int vit;
  private int radius;
  private boolean fromPlayer;
  
  public Bullet(int x, int y, boolean f){
    this.pos = new Position(x, y);
    this.fromPlayer = f;
    if(this.fromPlayer) this.vit = -12;
    else this.vit = 6;
    this.radius = 5;
  }
  
  public void display(){
    ellipse(this.pos.getX(), this.pos.getY(), this.radius, this.radius*2);
  }
  public void move(){
    if(this.fromPlayer) this.pos.setY(round(this.vit-(3*time)));
    else this.pos.setY(round(this.vit+(3*time)));
  }
  
  public Position getPos(){
    return this.pos;
  }
}

/**************** POSITION ****************/
class Position{
  private int x;
  private int y;
  
  public Position(int x, int y){
    this.x = x;
    this.y = y;
  }
  
  public void setX(int v){
    this.x += v;
  }
  public void setXTo(int v){
    this.x = v;
  }
  public void setY(int v){
    this.y += v;
  }
  public void setYTo(int v){
    this.y = v;
  }
  
  public int getX(){
    return this.x;
  }
  public int getY(){
    return this.y;
  }
}

void sound(String mess, float v){
  if(!muted) patch.send(mess, v);
  else patch.send(mess, 0);
}
