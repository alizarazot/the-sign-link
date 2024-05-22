import { getDefaultLogger } from "pkg/logging";

const log = getDefaultLogger().extend("Lesson");

export class Lesson {
  static readonly rootDirectory = location.origin + "/lesson";
  static readonly rootIndex = Lesson.rootDirectory + "/index.json";

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly require: Lesson[],
    public readonly description: string,
    public readonly summary: string,
    public readonly content: LessonContent[],
    public readonly questions: SingleChoiceQuestion[],
  ) {}

  static async avaible(): Promise<Lesson[]> {
    const lessonIndex = await (await fetch(Lesson.rootIndex)).json();

    let lessons: Lesson[] = [];

    for (let rawLesson of lessonIndex) {
      let require = Lesson.parseRequeriments(rawLesson.require, lessons);

      let rawLessonDetails: any;
      try {
        rawLessonDetails = await Lesson.rawLessonDetails(rawLesson.id);
      } catch (e) {
        log.error("Invalid or unexistent lesson content:", rawLesson.id);
        continue;
      }

      lessons.push(
        new Lesson(
          rawLesson.id,
          rawLesson.name,
          require,
          rawLessonDetails.description,
          rawLessonDetails.summary,
          [],
          [],
        ),
      );

      log.debug("Skipped content", rawLessonDetails.content);
      log.debug("Skipped questions", rawLessonDetails.question);
    }

    return lessons;
  }

  protected static parseRequeriments(
    require: string[],
    lessons: Lesson[],
  ): Lesson[] {
    let requeriments: Lesson[] = [];

    for (let r of require) {
      for (let l of lessons) {
        if (r === l.id) {
          requeriments.push(l);
        }
      }
    }

    return requeriments;
  }

  protected static async rawLessonDetails(id: string): Promise<any> {
    return await (
      await fetch(Lesson.rootDirectory + "/" + id + "/index.json")
    ).json();
  }
}

export class LessonContent {
  constructor(
    public readonly type: "title" | "paragraph" | "image",
    public readonly content: string,
  ) {}
}
