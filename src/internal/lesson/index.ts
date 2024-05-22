import { getDefaultLogger } from "pkg/logging";

export class Lesson {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly require: Lesson[],
    public readonly description: string,
    public readonly summary: string,
    public readonly content: LessonContent[],
    public readonly questions: SingleChoiceQuestion[],
  ) {}
}

export class LessonContent {
  constructor(
    public readonly type: "title" | "paragraph" | "image",
    public readonly content: string,
  ) {}
}

export async function avaibleLessons(): Promise<Lesson[]> {
  const log = getDefaultLogger().extend("Lesson");

  const lessonDirectory = location.origin + "/lesson";
  const lessonIndex = lessonDirectory + "/index.json";

  const response = await fetch(lessonIndex);
  const json = await response.json();

  let lessons: Lesson[] = [];

  for (let metadata of json) {
    let require: Lesson[] = [];
    for (let r of metadata.require) {
      for (let l of lessons) {
        if (r === l.id) {
          require.push(l);
        }
      }
    }

    let data: any;
    try {
      const response = await fetch(
        lessonDirectory + "/" + metadata.id + "/index.json",
      );
      data = await response.json();
    } catch (e) {
      log.error("Unexpected error:", e);
      continue;
    }

    lessons.push(
      new Lesson(
        metadata.id,
        metadata.name,
        require,
        data.description,
        data.summary,
        [],
        [],
      ),
    );

    log.debug("Skipped content", data.content);
    log.debug("Skipped questions", data.question);
  }

  return lessons;
}
