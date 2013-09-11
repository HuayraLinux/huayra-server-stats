huayraStats
============

**huayraStats** es una aplicación que permite visualizar servidores
de la distribución linux Huayra distribuidos en Argentina.

![](./images/preview.png)


API
---

<table>
	<tr>
		<th>Método</th>
		<th>URL</th>
		<th>Parámetros</th>
		<th>Descripción</th>
	</tr>
    <tr>
        <td>GET</td>
        <td>http://localhost:3000/api/puntos</td>
        <td>...</td>
        <td>Retorna todos los puntos del mapa en formato JSON.</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>http://localhost:3000/api/puntos</td>
        <td>mac</td>
        <td>Reporta la posición de un equipo.</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>http://localhost:3000/api/puntosprueba</td>
        <td>lat, lng, contenido</td>
        <td>Reporta la posición de un equipo con un dato de latitud y longitud de prueba.</td>
    </tr>
</table>


**Ejemplos de invocación:**

Solicitar todos los puntos del mapa:

```
curl http://localhost:3000/api/puntos
```

Informar una conexión con datos de prueba:

```
curl -d "lat=-34.428351&lng=-66.362915&contenido=Hola" http://localhost:3000/api/puntosprueba
```

Informar una conexión pero solo espeficando la IP del equipo (huayraStats averiguará
la posición aproximada del equipo automáticamente):

```
curl -d "mac=1c:a9:2b:59:aa:af" http://localhost:3000/api/puntos
```
