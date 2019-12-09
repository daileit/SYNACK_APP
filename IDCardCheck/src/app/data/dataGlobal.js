// -- Value data Global dùng để dùng như một biến state toàn cục của App.
// -- Biến rootGlobal sẽ tồn tại khi app Start và mất khi Skill App.

// Biến Gốc chứa giá trị con.
const ROOTGlobal = {
    "keys": { "a": 1, "b": 2 }, // key Demo
    loginToken: '',
    typeLogin: 0,
    dataUser: {},
    avatarUser: undefined,
    country: { name: '', id_Country: 0 },


};

// -- Các hàm xử lý thao tác với biến gốc ROOTGlobal

// Hàm get giá trị theo keys - read only. Giá trị thay đổi không làm thay đổi giá trị root
function AppgetGlobal(keys, defaultValue) {
    let temmp = ROOTGlobal[keys];
    return temmp == undefined ? defaultValue : temmp;
}

// Hàm get giá trị gốc theo keys - read write. Giá trị thay đổi làm thay đổi giá trị root
function AppgetRootGlobal(keys, defaultValue) {
    let temmp = ROOTGlobal[keys];
    return temmp == undefined ? defaultValue : temmp;
}

// Hàm khởi tạo một biến gốc, hay thay đổi một gốc.
function AppsetGlobal(keys, value) {
    ROOTGlobal[keys] = value;
}

export { AppgetGlobal, AppgetRootGlobal, AppsetGlobal, ROOTGlobal };

