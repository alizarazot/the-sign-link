export class Lesson {
  public readonly id: string;
  public readonly name: string;
  public readonly require: Lesson[];

  constructor(id: string, name: string, require: Lesson[]) {
    this.id = id;
    this.name = name;
    this.require = require;
  }
}

export async function avaibleLessons(): Promise<Lesson[]> {
  const lessonIndex = "lesson/index.json";

  const response = await fetch(lessonIndex);
  const json = await response.json();

  let lessons: Lesson[] = [];

  for (let data of json) {
    lessons.push(new Lesson(data.id, data.name, []));
    console.log("Skipped require:", data.require);
  }

  return lessons;
}
