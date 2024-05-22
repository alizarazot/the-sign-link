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

      let questions = Lesson.parseQuestions(rawLessonDetails.questions);

      lessons.push(
        new Lesson(
          rawLesson.id,
          rawLesson.name,
          require,
          rawLessonDetails.description,
          rawLessonDetails.summary,
          [],
          questions,
        ),
      );

      log.debug("Skipped content", rawLessonDetails.content);
    }

    return lessons;
  }

  protected static async rawLessonDetails(id: string): Promise<any> {
    return await (
      await fetch(Lesson.rootDirectory + "/" + id + "/index.json")
    ).json();
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

  protected static parseQuestions(questions: any): SingleChoiceQuestion[] {
    let parsedQuestions: SingleChoiceQuestion[] = [];

    for (let question of questions) {
      if (question.type !== "single-choice") {
        log.error("Unkonow question type:", question.type);
        continue;
      }

      parsedQuestions.push(SingleChoiceQuestion.parse(question));
    }

    return parsedQuestions;
  }
}

export class LessonContent {
  constructor(
    public readonly type: "title" | "paragraph" | "image",
    public readonly content: string,
  ) {}
}

export class SingleChoiceQuestion {
  constructor(
    public readonly question: string,
    public readonly answers: string[],
    private readonly _indexCorrect: number,
  ) {}

  get correct(): string {
    return this.answers[this._indexCorrect];
  }

  static parse(question: any): SingleChoiceQuestion {
    return new SingleChoiceQuestion(
      question.question,
      question.answers,
      question.correct,
    );
  }
}
