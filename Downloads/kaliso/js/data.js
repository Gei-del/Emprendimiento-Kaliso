(function(){
 const cfg=window.KASOLI_CONFIG;let client=null;
 function configured(){return Boolean(cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase)}
 function getClient(){if(!configured())return null;if(!client)client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);return client}
 async function listProducts(){const db=getClient();if(!db)return window.KASOLI_SEED_PRODUCTS.filter(p=>p.active);const{data,error}=await db.from("products").select("*").eq("active",true).order("sort_order");if(error)throw error;return data.length?data:window.KASOLI_SEED_PRODUCTS.filter(p=>p.active)}
 async function listAllProducts(){const db=getClient();if(!db)return window.KASOLI_SEED_PRODUCTS;const{data,error}=await db.from("products").select("*").order("sort_order");if(error)throw error;return data}
 async function signIn(email){const db=getClient();if(!db)throw new Error("La conexión segura del administrador aún no está configurada.");return db.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+"/admin.html"}})}
 async function session(){const db=getClient();if(!db)return null;return (await db.auth.getSession()).data.session}
 async function signOut(){const db=getClient();if(db)await db.auth.signOut()}
 async function saveProduct(product){const db=getClient();if(!db)throw new Error("Conecta Supabase antes de publicar cambios.");const{data,error}=await db.from("products").upsert(product).select().single();if(error)throw error;return data}
 async function removeProduct(id){const db=getClient();if(!db)throw new Error("Conecta Supabase antes de eliminar productos.");const{error}=await db.from("products").delete().eq("id",id);if(error)throw error}
 async function uploadImage(file){const db=getClient();if(!db)throw new Error("Conecta Supabase antes de subir imágenes.");const ext=(file.name.split(".").pop()||"jpg").toLowerCase();const path=`${Date.now()}-${crypto.randomUUID()}.${ext}`;const{error}=await db.storage.from("product-images").upload(path,file,{cacheControl:"31536000",upsert:false});if(error)throw error;return db.storage.from("product-images").getPublicUrl(path).data.publicUrl}
 window.KasoliData={configured,getClient,listProducts,listAllProducts,signIn,session,signOut,saveProduct,removeProduct,uploadImage};
})();
