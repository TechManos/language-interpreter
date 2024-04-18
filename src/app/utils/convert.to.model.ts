function excludeCreatedOn(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (key !== 'createdOn') {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function convertToModel(snapshot: any): object {
  if (snapshot.val()?.createdOn) {
    const tempObj = {
      id: snapshot.key,
      // TODO: check how the object looks like
      createdOn: new Date(snapshot.val().createdOn),
      ...excludeCreatedOn(snapshot.val()),
    };

    return tempObj;
  } else {
    return {
      id: snapshot.key,
      ...snapshot.val(),
    };
  }
}
