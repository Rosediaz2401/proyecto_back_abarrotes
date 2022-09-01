const { Router } = require("express");
const router = Router();
const Pool = require("../db.config");

//Get clientes
router.get("/clientes", async (req, res) => {
	const response = await Pool.query("Select * from clientes");
	//console.log( response.rows )
	res.status(200).json(response.rows);
});

//Crear clientes
router.post("/add-clientes", async (req, res) => {
    const {
      nombre,
      apellidos,
      email,
      telefono,
      direccion,
      cp,
      barrio,
      ciudad,
    } = req.body;
    const response = await Pool.query(
      "insert into clientes( nombre, apellidos, email, telefono, direccion, cp, barrio,ciudad) values ($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        nombre,
        apellidos,
        email,
        telefono,
        direccion,
        cp,
        barrio,
        ciudad,
      ]
    );
    res.status(201).json({
      message: "Se ha agregado un nuevo cliente!",
      body: { nombre, apellidos },
    });
  });

//Borrar Clientes
router.delete("/clientes/:id", async (req, res) => {
	const { id } = req.params;
	await Pool.query("delete from clientes where id = $1", [id]);
	res
		.status(200)
		.json({ message: "se ha borrado un empleado" });
});

// 1 ID de los clientes de la Ciudad de Monterrey
router.get("/clientesporciudad/:ciudad", async (req, res) => {
	console.log("finding");

	const response = await Pool.query(
		"select * from clientes where ciudad = 'Monterrey'"
	);

	if (!response.rows.length) res.status(404).json({ message: "Cliente no encontrado" });

	res.status(200).json(response.rows);
});

//2 ID y descripcion de los productos que cuesten menos de 15 pesos
router.get("/productosmenoresa/:precio", async (req, res) => {
	console.log("finding");

	const response = await Pool.query(
		"select * from productos where precio < 15"
	);

	if (!response.rows.length) res.status(404).json({ message: "Productos no encontrado" });

	res.status(200).json(response.rows);
});

//3 ID y nombre de los clientes, cantidad vendida y descripcion del producto en las ventas en las cuales se vedieron mas de 10 unidades

router.get("/productosmayoresa/:precio", async (req, res) => {
	console.log("finding");

	const response = await Pool.query(
        "select v.cantidad_vendida, c.id,c.nombre, p.descripcion from ventas v inner join clientes c on c.id= v.clientes_id inner join productos p on p.id = v.productos_id where v.cantidad_vendida >10"
      );
    
      if (!response.rows.length) res.status(404).json({ message: "Products not found" });
    
      res.status(200).json(response.rows);
});

// 4 ID y nombre de los clientes que no aparecen en la tabla de ventas(clientes que han comprado productos)
router.get("/clientessincompras/:cantidad_vendida", async (req, res) => {
	console.log("finding");

	const response = await Pool.query(
        "select v.cantidad_vendida, c.nombre from ventas v inner join clientes c on c.id= v.clientes_id where v.cantidad_vendida = 0 LIMIT 1"
      );
    
      if (!response.rows.length) res.status(404).json({ message: "Cliente no encontrado" });
    
      res.status(200).json(response.rows);
});

// 5 ID y nombre de los clientes que han comprado todos los productos de la empresa
router.get("/clientestodoslosproductos", async (req, res) => {
	console.log("finding");

	const response = await Pool.query(
        "select c.id, c.nombre from clientes c inner join ventas v on c.id = v.clientes_id where (select count(distinct v.productos_id) from ventas v where c.id = v.clientes_id) = (select count (*) from productos)  and v.cantidad_vendida !=0 LIMIT 1"
      );
    
      if (!response.rows.length) res.status(404).json({ message: "Cliente no encontrado" });
    
      res.status(200).json(response.rows);
});

//6 ID y nombre de cada cliente y la suma total(suma de cantidad) de los productos que ha comprado
router.get("/productoscomprados/", async (req, res) => {
	console.log("finding");

	const response = await Pool.query(
        "select c.id, c.nombre, SUM(cantidad_vendida) as productos_comprados  from ventas v join clientes c on c.id = v.clientes_id where cantidad_vendida !=0 group by c.id"
      );
    
      if (!response.rows.length) res.status(404).json({ message: "Cliente no encontrado" });
    
      res.status(200).json(response.rows);
});

// 7 ID de los productos que no han sido comprados por clientes de Guadalajara

router.get("/productosnocompradosen/:ciudad", async (req, res) => {
    console.log("finding");
  
    const response = await Pool.query(
      "select v.cantidad_vendida,c.nombre, c.ciudad, p.id, p.descripcion from ventas v inner join clientes c  on c.id  = v.clientes_id inner join productos p on p.id = v.productos_id where v.cantidad_vendida = 0 and  c.ciudad = 'Guadalajara'"
    );
  
    if (!response.rows.length) res.status(404).json({ message: "Products not found" });
  
    res.status(200).json(response.rows);
  });


  // 8 products sold in MTY and CUN
router.get("/productosvendidosenmtyycun/:cantidad_vendida", async (req, res) => {
    console.log("finding");
  
    const response = await Pool.query(
      "select c.nombre as cuidad_nombre,v.cantidad_vendida as cantidad_vendida,p.id as producto_id,p.nombre as producto_nombre from ventas v inner join ciudades c on c.id = v.ciudad_id inner join productos p on p.id = v.productos_id where c.id in (1,2) and v.cantidad_vendida > 0"
    );
  
    if (!response.rows.length) res.status(404).json({ message: "Products not found" });
  
    res.status(200).json(response.rows);
  });

  //-- 9 Nombre de las ciudades en las que se han vendido todos los productos

  router.get("/ciudadestodoslosproductos", async (req, res) => {
    console.log("finding");
  
    const response = await Pool.query(
      "select c.nombre from ciudades c inner join ventas v on c.id = v.ciudad_id where (select count(distinct v.productos_id) from ventas v where c.id = v.ciudad_id) = (select count (*) from productos) and v.cantidad_vendida >0 LIMIT 1"
    );
  
    if (!response.rows.length) res.status(404).json({ message: "Products not found" });
  
    res.status(200).json(response.rows);
  });

//Update clientes
router.put("/actualizarclientes/:id", async (req, res) => {
    const { id } = req.params;
    const {
      nombre,
      apellidos,
      email,
      telefono,
      direccion,
      cp,
      barrio,
      ciudad,
    } = req.body;
    //verify the employee before update 102
    const checkClientes = await Pool.query(
      "select * from clientes where id = " + id
    );
    if (!checkClientes.rows.length) {
      return res.status(404).json({ message: "Customer not found" });
    }
    console.log('updating')
  
    await Pool.query(
      "UPDATE clientes SET nombre = $1, apellidos = $2, email = $3, telefono = $4, direccion = $5, cp = $6, barrio = $7, ciudad = $8 WHERE id = $9",
      [
        nombre,
        apellidos,
        email,
        telefono,
        direccion,
        cp,
        barrio,
        ciudad,
        id,
      ]
    );
  
    res
      .status(201)
      .json({ message: "The customer has been updated with success!!" });
  
  });


module.exports = router;