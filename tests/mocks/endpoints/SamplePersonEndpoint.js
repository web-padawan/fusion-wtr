import { stub } from 'sinon';

let data = [
  {
    dateOfBirth: '1951-06-07',
    email: 'eula.lane@jigrormo.ye',
    firstName: 'Eula',
    id: 101,
    important: false,
    lastName: 'Lane',
    occupation: 'Museum Curator',
    phone: '(680) 123-4567',
  },
  {
    dateOfBirth: '2010-06-07',
    email: 'barry.rodriquez@zun.mm',
    firstName: 'Barry',
    id: 102,
    important: false,
    lastName: 'Rodriquez',
    occupation: 'Aviation Maintenance Instructor',
    phone: '(680) 789-6543',
  },
  {
    dateOfBirth: '1970-05-23',
    email: 'eugenia.selvi@capfad.vn',
    firstName: 'Eugenia',
    id: 103,
    important: false,
    lastName: 'Selvi',
    occupation: 'HR Clerk',
    phone: '(680) 368-2192',
  },
];

export const count = stub().resolves(data.length);

export const get = stub().callsFake((id) => data.find((item) => item.id === id));

export const list = stub().resolves([...data]);

