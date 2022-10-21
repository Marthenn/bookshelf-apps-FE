const bookShelf = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOK_APPS';
let readShelf = false;

const localReadBooksKey = 'READ_BOOKS';
const localUnreadBooksKey = 'UNREAD_BOOKS';

function checkStorage(){
    if(typeof(Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function createId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete){
    return{
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId){
    for(const book of bookShelf){
        if(book.id===bookId){
            return book;
        }
    }
    return null;
}

function findBookIndex(bookId){
    for(const index in bookShelf){
        if(bookShelf[index].id===bookId){
            return index;
        }
    }
    return -1;
}

function saveData(){
    if(checkStorage()){
        const parsed = JSON.stringify(bookShelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function getDataFromLocal(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let books=JSON.parse(serializedData);
    if(books!==null){
        for(const book of books){
            bookShelf.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(book){
    const bookContainer= document.createElement('article');
    bookContainer.classList.add('book_item');

    const bookTitle = document.createElement('h3');
    bookTitle.innerText=book.title;
    bookContainer.appendChild(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText=`Penulis: ${book.author}`;
    bookContainer.appendChild(bookAuthor);

    const bookYear = document.createElement('p');
    bookYear.innerText=`Tahun: ${book.year}`;
    bookContainer.appendChild(bookYear);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    
    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.innerText='Edit Buku';
    editButton.addEventListener('click', function(){
        editBook(book.id);
    });
    buttonContainer.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.innerText='Hapus Buku';
    deleteButton.addEventListener('click', function(){
        deleteBook(book.id);
    });
    buttonContainer.appendChild(deleteButton);

    bookContainer.appendChild(buttonContainer);
    return bookContainer;
}

function addBook(){
    const title = document.getElementById('titleBaru').value;
    const author = document.getElementById('authorBaru').value;
    const year = document.getElementById('yearBaru').value;
    const isComplete = document.getElementById('isCompleteBaru').checked;
    const id = createId();
    const bookObject = generateBookObject(id, title, author, year, isComplete);
    bookShelf.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBook(bookId){
    const book = findBook(bookId);
    if(book==null)return;
    let newTitle = prompt('Masukkan judul baru (kosongkan bila tidak ingin mengubah)');
    let newAuthor = prompt('Masukkan penulis baru (kosongkan bila tidak ingin mengubah)');
    let newYear = prompt('Masukkan tahun baru (kosongkan bila tidak ingin mengubah)');
    let newIsComplete = confirm('Apakah sudah selesai dibaca?(Y/N)');
    if(newTitle!==null && newTitle!==''){
        book.title=newTitle;
    }
    if(newAuthor!==null && newAuthor!==''){
        book.author=newAuthor;
    }
    if(newYear!==null && newYear!==''){
        book.year=newYear;
    }
    if(newIsComplete!==null){
        if(newIsComplete=='Y'){
            book.isComplete=true;
        } else if (newIsComplete=='N'){
            book.isComplete=false;
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBook(bookId){
    const index = findBookIndex(bookId);
    if(index===-1)return;
    bookShelf.splice(index, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function(){
    const submitButton = document.getElementById('tambahBuku');
    submitButton.addEventListener('click', function(){
        Event.preventDefault();
        addBook();
    });

    const changeButton = document.getElementById('changeShelf');
    changeButton.addEventListener('click', function(){
        readShelf = !readShelf;
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    if(checkStorage()){
        getDataFromLocal();
    }
});

document.addEventListener(SAVED_EVENT, function(){
    console.log('Data berhasil disimpan');
});

document.addEventListener(RENDER_EVENT, function(){
    const shelfTitle = document.getElementById('bookshelf-title');
    if(readShelf){
        shelfTitle.innerText='Daftar Buku Sudah Dibaca';
    } else {
        shelfTitle.innerText='Daftar Buku Belum Dibaca';
    }

    const bookList = document.getElementById('bookshelf-list');
    bookList.innerHTML='';
    for(const book of bookShelf){
        if(readShelf){
            if(book.isComplete){
                const bookContainer = makeBook(book);
                bookList.appendChild(bookContainer);
            }
        } else {
            if(!book.isComplete){
                const bookContainer = makeBook(book);
                bookList.appendChild(bookContainer);
            }
        }
    }
});