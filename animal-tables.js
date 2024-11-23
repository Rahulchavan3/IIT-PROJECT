class AnimalTable {
    constructor(species, containerId, jsonData, sortableFields) {
      this.species = species;
      this.containerId = containerId;
      this.jsonData = jsonData;
      this.sortableFields = sortableFields;
      this.renderTable();
    }
  
    renderTable() {
      const container = document.getElementById(this.containerId);
      container.innerHTML = this.generateTableHTML();
      this.attachEventListeners();
    }
  
    generateTableHTML() {
      return `
          <div class="table-container mt-4">
              
              
              
              
              <form id="${this.containerId}-form" class="mt-4 p-3 border rounded bg-light">
                <input type="hidden" id="${this.containerId}-edit-index" value="">
                <div class="row g-3">
                    <div class="col-md-3">
                        <input type="text" id="${this.containerId}-name" class="form-control" placeholder="Name" required>
                    </div>
                    <div class="col-md-2">
                        <input type="number" id="${this.containerId}-size" class="form-control" placeholder="Size" required>
                    </div>
                    <div class="col-md-3">
                        <input type="text" id="${this.containerId}-location" class="form-control" placeholder="Location" required>
                    </div>
                    <div class="col-md-3">
                        <input type="file" id="${this.containerId}-image" class="form-control" accept="image/*">
                    </div>
                    <div class="col-md-1 d-flex justify-content-center align-items-center">
                        <button type="submit" id="${this.containerId}-submit-btn" class="btn  w-100" style="background-color:#E15A46">Add</button>
                    </div>
                </div>
            </form>
              
              
              <div class="table-responsive mt-4">
                  <table class="table table-bordered table-hover align-middle">
                      <thead class="table-dark text-center">
                          <tr>
                              <th>Photo</th>
                              <th>Species</th>
                              <th>Name ${this.getSortButton('name')}</th>
                              <th>Size ${this.getSortButton('size')}</th>
                              <th>Location ${this.getSortButton('location')}</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${this.jsonData.map((item, index) => this.generateRowHTML(item, index)).join('')}
                      </tbody>
                  </table>
              </div>
          </div>
      `;
  }
  generateRowHTML(item, index) {
    const defaultImageSrc = 'https://via.placeholder.com/60'; 
    return `
        <tr data-index="${index}">
            <td data-label="Photo" class="text-center">
                <div class="hover-container">
                    <img src="${item.image || defaultImageSrc}" alt="${item.name}" class="animal-img">
                </div>
            </td>
            <td data-label="Species" class="text-center">${this.species}</td>
            <td data-label="Name" class="text-capitalize">${this.formatName(item.name)}</td>
            <td data-label="Size" class="text-center">${item.size} ft</td>
            <td data-label="Location">${item.location}</td>
            <td data-label="Actions" class="text-center">
                <button class="btn btn-warning btn-sm edit-btn mx-1">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn mx-1">Delete</button>
            </td>
        </tr>
    `;
  }
  
  
  
    
    
  
  
    getSortButton(field) {
      if (this.sortableFields.includes(field)) {
        return `
          <button class="btn btn-light btn-sm sort-btn" data-field="${field}">
            <i class="bi bi-sort-alpha-down"></i> Sort
          </button>
        `;
      }
      return '';
    }
    
  
    attachEventListeners() {
      const form = document.getElementById(`${this.containerId}-form`);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.addAnimal(); 
    });
  
      document.querySelectorAll(`#${this.containerId} .delete-btn`).forEach((btn) =>
        btn.addEventListener('click', (event) => this.deleteAnimal(event))
      );
  
      document.querySelectorAll(`#${this.containerId} .edit-btn`).forEach((btn) =>
        btn.addEventListener('click', (event) => this.editAnimal(event))
      );
  
      document.querySelectorAll(`#${this.containerId} .sort-btn`).forEach((btn) =>
        btn.addEventListener('click', (event) => this.sortAnimals(event))
      );
    }
  
    addAnimal() {
      const name = document.getElementById(`${this.containerId}-name`).value.trim();
      const size = parseFloat(document.getElementById(`${this.containerId}-size`).value);
      const location = document.getElementById(`${this.containerId}-location`).value.trim();
      const imageInput = document.getElementById(`${this.containerId}-image`);
      const imageFile = imageInput.files[0];
      const editIndex = document.getElementById(`${this.containerId}-edit-index`).value; // Get the edit index
  
      if (!name || isNaN(size) || !location) {
        alert('Please provide valid inputs.');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = () => {
        const image = reader.result || 'https://via.placeholder.com/50';
        if (editIndex) {
          
          this.jsonData[editIndex] = { name, size, location, image };
          document.getElementById(`${this.containerId}-edit-index`).value = ""; 
        } else {
         
          this.jsonData.push({ name, size, location, image });
        }
        this.toggleButtonText('Add'); 
        this.renderTable();
      };
  
      if (imageFile) {
        reader.readAsDataURL(imageFile);
      } else {
        const defaultImage = 'https://via.placeholder.com/50';
        if (editIndex) {
          this.jsonData[editIndex] = { name, size, location, image: defaultImage };
          document.getElementById(`${this.containerId}-edit-index`).value = "";
        } else {
          this.jsonData.push({ name, size, location, image: defaultImage });
        }
        this.toggleButtonText('Add');
        this.renderTable();
      }
    }
          updateAnimal(index) {
        const name = document.getElementById(`${this.containerId}-name`).value.trim();
        const size = parseFloat(document.getElementById(`${this.containerId}-size`).value);
        const location = document.getElementById(`${this.containerId}-location`).value.trim();
        const imageInput = document.getElementById(`${this.containerId}-image`);
        const imageFile = imageInput.files[0];
    
        if (!name || isNaN(size) || !location) {
            alert('Please provide valid inputs.');
            return;
        }
    
    
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = () => {
                this.jsonData[index] = { ...this.jsonData[index], name, size, location, image: reader.result };
                document.getElementById(`${this.containerId}-edit-index`).value = ""; // Clear edit mode
                this.renderTable();
            };
            reader.readAsDataURL(imageFile);
        } else {
            
            this.jsonData[index] = { ...this.jsonData[index], name, size, location };
            document.getElementById(`${this.containerId}-edit-index`).value = ""; // Clear edit mode
            this.renderTable();
        }
    }
    
  
  
    deleteAnimal(event) {
      const index = event.target.closest('tr').dataset.index;
      this.jsonData.splice(index, 1);
      this.renderTable();
    }
    editAnimal(event) {
      const row = event.target.closest('tr');
      const index = row.dataset.index;
  
      
      document.getElementById(`${this.containerId}-name`).value = this.jsonData[index].name;
      document.getElementById(`${this.containerId}-size`).value = this.jsonData[index].size;
      document.getElementById(`${this.containerId}-location`).value = this.jsonData[index].location;
      document.getElementById(`${this.containerId}-edit-index`).value = index; 
  
      this.toggleButtonText('Submit');
    }

      attachEventListeners() {
        const form = document.getElementById(`${this.containerId}-form`);
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          this.addAnimal(); 
        });
      
        document.querySelectorAll(`#${this.containerId} .delete-btn`).forEach((btn) =>
          btn.addEventListener('click', (event) => this.deleteAnimal(event))
        );
      
        document.querySelectorAll(`#${this.containerId} .edit-btn`).forEach((btn) =>
          btn.addEventListener('click', (event) => this.editAnimal(event)) 
        );
      
        document.querySelectorAll(`#${this.containerId} .sort-btn`).forEach((btn) =>
          btn.addEventListener('click', (event) => this.sortAnimals(event))
        );
      }
      
      toggleButtonText(mode) {
        const submitButton = document.getElementById(`${this.containerId}-submit-btn`);
        submitButton.textContent = mode; 
      }
  
    sortAnimals(event) {
      const field = event.target.dataset.field;
      this.jsonData.sort((a, b) => (a[field] > b[field] ? 1 : -1));
      this.renderTable();
    }
  
    formatName(name) {
      return name; 
    }
  }
  
  class BigCatTable extends AnimalTable {
    formatName(name) {
      return name; 
    }
  }
  
  class DogTable extends AnimalTable {
    formatName(name) {
      return `<span class="table2-name">${name}</span>`;
    }
  }
  
  class BigFishTable extends AnimalTable {
    formatName(name) {
      return `<span class="table3-name">${name}</span>`;
    }
  }
  

  const bigCatsData = [
    { name: 'Tiger', size: 10, location: 'Asia', image: './images/tiger.png' },
    { name: 'Lion', size: 8, location: 'Africa', image: './images/lion.png' },
    { name: 'Leopard', size: 5, location: 'Africa and Asia', image: './images/Leopard.png' },
    { name: 'Cheetah', size: 5, location: 'Africa', image: './images/Cheetah.png' },
    { name: 'Caracal', size: 3, location: 'Africa', image: './images/Caracal.png' },
    { name: 'Jaguar', size: 5, location: 'Amazon', image: './images/Jaguar.png' },
  ];
  
  const dogsData = [
    { name: 'Rottweiler', size: 2, location: 'Germany', image: './images/tiger.png' },
    { name: 'German Shepherd', size: 2, location: 'Germany', image: './images/German Shepherd.png' },
    { name: 'Labrador', size: 2, location: 'UK', image: './images/Labrador.png' },
    { name: 'Alabai', size: 4, location: 'Turkey', image: './images/Alabai.png' },
  ];
  
  const bigFishData = [
    { name: 'Humpback Whale', size: 15, location: 'Atlantic Ocean', image: './images/Humpback Whale.png' },
    { name: 'Killer Whale', size: 12, location: 'Atlantic Ocean', image: './images/Killer Whale.png' },
    { name: 'Tiger Shark', size: 8, location: 'Ocean', image: './images/Tiger Shark.png' },
    { name: 'Hammerhead Shark', size: 8, location: 'Ocean', image: './images/Hammerhead Shark.png' },
  ];
  

  new BigCatTable('Big Cats', 'bigCatsTable', bigCatsData, ['name', 'size', 'location']);
  new DogTable('Dogs', 'dogsTable', dogsData, ['name', 'location']);
  new BigFishTable('Big Fish', 'bigFishTable', bigFishData, ['size']);
  