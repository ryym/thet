let _incrementalId = 1;

type InitialProps = {
  title: string,
  completed?: boolean,
}

export class Todo {
  static create(props: InitialProps): Todo {
    const id = _incrementalId++;
    return new Todo(id, props);
  }

  readonly id: number;
  title: string;
  completed: boolean;

  constructor(id: number, { title, completed = false }: InitialProps) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}

export type TodoCounts = {
  all: number,
  active: number,
  completed: number,
}
