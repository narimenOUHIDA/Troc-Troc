export function getInitials(firstName = "", lastName = "") {

    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);

    return (firstInitial + lastInitial).toUpperCase();

}