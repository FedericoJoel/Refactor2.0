Struct Cancion {
	int id_cancion;
	int id_album;
	int orden;
	char[2048] audio;
};

Struct Album {
	int id_album;
	Album *sig;
	Nodo<Cancion> *canciones;
}

int criterio(Cancion c1, Cancion c2){
	return c1.orden - c2.orden;
}

cargarCache (ruta){
	Album* albumes = NULL;
	FILE* f = fopen(ruta,"fb+");
	Cancion c;
	fread(&c,sizeof(Cancion),1,f);
	while(!feof(f)){
		Album * album = buscar(albumes,c.id_album); // Crea un elemento de tipo Album y busca en la estructura de ALBUMES si ya existe ese album.
		if(album == NULL){
			agregar(albumes,c.id_album);
			album = buscar(albumes,c.id_album); //Obtiene la posición del registro recién cargado.
		}
		insertarOrdenado<Cancion>(album->canciones,c,criterio);
		fread(&c,sizeof(Cancion),1,f);

	}
	fclose(f);
	return albumes;
	
	

}




////////////ANTIVIRUS
Struct Firma {
	int id;
	char[25] nombre;
	char[25] firma;
}

Struct ListaFirmas {
	ListaFirmas* sig;
	Nodo<Firma> *firmasleidas;
}

int criterioAlfabetico{
	//No logro entender como establecer este criterio.
}

void leer(){
	ListaFirmas* firmas = NULL;
	FILE* f = fopen("firmas.dat","rb+");
	Firma fir;
	fread(&fir,sizeof(Firma),1,f);
	while(!feof(f)){
		insertarOrdenado<Firma>(firmas->firmasleidas,fir,criterioAlfabetico);
		fread(&fir,sizeof(Firma),1,f);
	}
}

bool analizar(string archivos[], int tamanio, Nodo* firmas){
	bool virus = false;
	int busqueda = 0;
	for(int i = 0; i <= tamanio; i++){
		FILE* f = fopen(archivos[i],"rb+");
		Firma firmaarchivo;
		fread(&firmaarchivo,sizeof(Firma),1,f);
		while(!feof(f)){
			busqueda = buscar(firmasleidas,firmaarchivo);
			if(busqueda != NULL){virus = true;}
			fread(&firmaarchivo,sizeof(Firma),1,f);
		}
		fclose(f);
	}
	return virus;
}

void guardar() {
	//
}


































