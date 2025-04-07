export const DB_NAME = "codesangam";

export const UserRolesEnum = {
    USER: "USER",
    ADMIN: "ADMIN",
}

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const UserLoginType = {
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
    GOOGLE: "GOOGLE",
    GITHUB: "GITHUB",
};

export const AvailableSocialLogins = Object.values(UserLoginType);

export const USER_TEMPORARY_TOKEN_EXPIRY  = 20 * 60 * 1000; // 20 minutes