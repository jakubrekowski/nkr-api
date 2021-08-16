const permissions = [
  {
    permission: 'ADD_CONTENT',
    value: 0b1,
  },{
    permission: 'VERIFY_CONTENT',
    value: 0b10,
  },{
    permission: 'DELETE_CONTENT',
    value: 0b100,
  },{
    permission: 'MANAGE_ROLES',
    value: 0b1000,
  },
];

export const readInt = (permissionInt) => {
  if (!permissionInt) throw new Error('Invalid token.');

  const permissionList = permissionInt.toString(2).split('').reverse();
  const foundPermissions = [];

  permissionList.forEach((element, index) => {
    if (element === '1') {
      let byteIntiger = element;
      for (let i = 0; i < index; i++) {
        byteIntiger += '0';
      }

      const found = permissions.find(permission => permission.value.toString(2) === byteIntiger);
      if (found) {
        foundPermissions.push(found.permission);
      }
    }
  })

  return foundPermissions;
}