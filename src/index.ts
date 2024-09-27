import express, {Request, Response} from "express";
import mysql from "mysql2/promise";

const app = express();

// Configura EJS como a engine de renderização de templates
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const connection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});

// Middleware para permitir dados no formato JSON
app.use(express.json());
// Middleware para permitir dados no formato URLENCODED
app.use(express.urlencoded({ extended: true }));


// Categorias

app.get('/categories', async function (req: Request, res: Response) {
    const [rows] = await connection.query("SELECT * FROM categories");
    return res.render('categories/listC', {
        categories: rows
    });
});

app.get("/categories/form", async function (req: Request, res: Response) {
    return res.render("categories/formC");
});

app.post("/categories/save", async function(req: Request, res: Response) {
    const body = req.body;
    const insertQuery = "INSERT INTO categories (name) VALUES (?)";
    await connection.query(insertQuery, [body.name]);

    res.redirect("/categories");
});

app.post("/categories/delete/:id", async function (req: Request, res: Response) {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM categories WHERE id = ?";
    await connection.query(sqlDelete, [id]);

    res.redirect("/categories");
});


// Usuários

app.get("/user/add", function(req: Request, res:Response){
    return res.render('categories/formU')
});

app.post('/user', async function(req: Request, res:Response){
    const body = req.body;
    const insertQuery = "INSERT INTO users (name, email, password, role, active) VALUES (?,?,?,?,?)"
    let active = false

    if(body.active === "on"){
        active = true
    }

    await connection.query(insertQuery, [body.name, body.email, body.password, body.role, active])

    res.redirect('/user')
})

app.get('/user', async function (req: Request, res: Response){
    const [rows] = await connection.query("SELECT * FROM users")
    return res.render('categories/listU', {
        users: rows
    })
})

app.post('/user/delete/:id', async function (req: Request, res:Response){
    const id = req.params.id
    const sqlDelete = "DELETE FROM users WHERE id = ?"
    await connection.query(sqlDelete, [id])

    res.redirect("/user")
})


// Login

app.get('/login', function (req: Request, res: Response){
    return res.render('categories/login');
});

app.post('/login', async function (req: Request, res: Response){
    const body = req.body;
    const sqlLogin = "SELECT * FROM user WHERE email = ? AND password = ?";

    try{
        const [rows] = await connection.query<any[]>(sqlLogin, [body.email, body.password])

        if(rows.length === 0){
            return res.render('categories/login', {error: "Usário e/ou senha errados."})
        }
        
        res.redirect('/user')
    } catch (error){
        console.log(error)
    }
})


// Tela inicial 

app.get('/', function (req: Request, res: Response){
    return res.render('categories/inicialP');
});

app.listen('3000', () => console.log("Server is listening on port 3000"));