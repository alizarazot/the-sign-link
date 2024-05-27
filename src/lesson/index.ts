const rootDirectory = location.origin + "/lesson";
const rootIndex = rootDirectory + "/index.json";

export class LessonMetadata {
  constructor(
    private readonly _id: string,
    public readonly name: string,
    public readonly require: LessonMetadata[],
  ) {}

  async load(): Promise<LessonData> {
    const rawLesson = await LessonMetadata.rawLessonDetails(this._id);

    return new LessonData(
      rawLesson.title,
      rawLesson.description,
      rawLesson.summary,
      LessonMetadata.parseQuestions(rawLesson.questions),
    );
  }

  protected static async rawLessonDetails(id: string): Promise<any> {
    return await (await fetch(rootDirectory + "/" + id + "/index.json")).json();
  }

  protected static parseQuestions(questions: any): Question[] {
    let parsedQuestions: Question[] = [];

    for (let question in questions) {
      parsedQuestions.push(Question.parse(questions[question]));
    }

    return parsedQuestions;
  }
}

export class LessonData {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly questions: Question[],
  ) {}
}

export class LessonContent {
  constructor(
    public readonly type: "title" | "paragraph" | "image",
    public readonly content: string,
  ) {}

  static parse(content: any): LessonContent {
    if (content.type === "image") {
      return new LessonContent(
        content.type,
        rootDirectory + "/image/" + content.content,
      );
    }

    return new LessonContent(content.type, content.content);
  }

  static parseList(content: any): LessonContent[] {
    let parsedContent: LessonContent[] = [];

    for (let c of content) {
      parsedContent.push(LessonContent.parse(c));
    }

    return parsedContent;
  }
}

export class Question {
  constructor(
    public readonly lesson: LessonContent[],
    public readonly question: string,
    public readonly answers: string[],
    private readonly _indexCorrect: number,
  ) {}

  get correct(): string {
    return this.answers[this._indexCorrect];
  }

  static parse(question: any): Question {
    return new Question(
      LessonContent.parseList(question.lesson),
      question.question,
      question.answers,
      question.correct,
    );
  }
}

export async function avaibleLessons(): Promise<Map<string, LessonMetadata>> {
  const lessonIndex = await (await fetch(rootIndex)).json();

  let lessons = new Map<string, LessonMetadata>();

  for (let rawLesson of lessonIndex) {
    let require = parseLessonRequeriments(rawLesson.require, lessons);

    lessons.set(
      rawLesson.id,
      new LessonMetadata(rawLesson.id, rawLesson.name, require),
    );
  }

  return lessons;
}

function parseLessonRequeriments(
  require: string[],
  lessons: Map<string, LessonMetadata>,
): LessonMetadata[] {
  let requeriments: LessonMetadata[] = [];

  for (let req of require) {
    for (let [id, lesson] of lessons) {
      if (req === id) {
        requeriments.push(lesson);
      }
    }
  }

  return requeriments;
}
