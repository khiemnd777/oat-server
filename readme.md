1. Clone repository
```
git clone https://github.com/khiemnd777/oat-server.git
```
2. Build **nopCommerce** via Task
```
build nopCommerce
```
3. Build **api-for-nopcommerce** via Task
```
build api-for-nopcommerce plugin
```
4. Setup PostgreSQL database

The PostgreSQL database that you can initialize via **nopCommerce Installation** web-base or directly restore default data via backup file at
[oat\_10\_jun_2023.sql](https://1drv.ms/u/s!Anshfqp6K172j_Bn4TQQor3GQJEo6Q?e=ONC0bl "‌").

Then, you must copy the [appsettings.json](https://1drv.ms/u/s!Anshfqp6K172j_BozQp-e3dM48yFRg?e=R3okn4 "‌") to `App_Data` folder, and must change `userName`, `password` and `databaseName`.

Finally, you have to change the cache folder in the `appsettings.json` like below:

```json
"WebOptimizer": {
  "CacheDirectory": "<yourRootDirectory>\\nopCommerce\\Presentation\\Nop.Web\\wwwroot\\bundles"
}
```

5. Run and Debug via `nopCommerce Launch`.

6. Go to `/api/swagger` page and experiment with the api

> Use the Authorize button to authenticate requests and run application (ClientApp project) to get authorized token through debugging via `Api Swagger Launch`.
