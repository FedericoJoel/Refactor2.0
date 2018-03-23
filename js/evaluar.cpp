bool evaluar(string arr[], int tamanio) {
	Nodo<string>* p = NULL;
	bool resultado = 1;
	for(int i = 0; i< tamanio; i++) {
		if(arr[i].compare("<body>") == 0||arr[i].compare("<center>") == 0||arr[i].compare("<h1>") == 0) {
			push(p,arr[i]);
		} else if(arr[i].compare("</body>") == 0||arr[i].compare("</center>") == 0||arr[i].compare("</h1>") == 0) {
			string poped = pop(p);
			if(arr[i].compare("</body>") == 0 && poped.compare("<body>") != 0) {
				resultado = 0;
			} else if(arr[i].compare("</center>") == 0 && poped.compare("<center>") != 0) {
				resultado = 0;
			} else if(arr[i].compare("</h1>") == 0 && poped.compare("<h1>") != 0) {
				resultado = 0;
			}
		}
	}
	return !vacia(p)||resultado;
}