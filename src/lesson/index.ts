const rootDirectory = location.origin + "/lesson";
const rootIndex = `${rootDirectory}/index.json`;

export class Lesson {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly questions: Map<string, Question>,
  ) {}
}

export class Question {
  constructor(
    public readonly information: Information[],
    public readonly question: string,
    public readonly answers: string[],
    public readonly correct: number,
  ) {}

  static parse(question: any): Question {
    return new Question(
      Information.parseList(question.lesson),
      question.question,
      question.answers,
      question.correct,
    );
  }
}

export class Information {
  constructor(
    public readonly type: "title" | "paragraph" | "image",
    public readonly content: string,
  ) {}

  static parse(content: any): Information {
    if (content.type === "image") {
      return new Information(
        content.type,
        `${rootDirectory}/image/${content.content}`,
      );
    }

    return new Information(content.type, content.content);
  }

  static parseList(content: any): Information[] {
    let parsedContent: Information[] = [];

    for (let c of content) {
      parsedContent.push(Information.parse(c));
    }

    return parsedContent;
  }
}

export async function avaibleLessons(): Promise<string[]> {
  return await (await fetch(rootIndex)).json();
}

export async function loadLesson(id: string): Promise<Lesson> {
  const lesson = await (await fetch(`${rootDirectory}/${id}.json`)).json();
  lesson.questions = new Map(Object.entries(lesson.questions));

  for (let [_, question] of lesson.questions) {
    question.information = Information.parseList(question.information);
  }

  return lesson;
}
