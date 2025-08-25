export const getProfileImage = (file) => {
    if (file && typeof file == "string") return file;
    if (file && typeof file == "object") return file.uri;

    return require("../assets/images/defaultAvatar.png")
}

// basically if no file return the default im but if tere is file load it 