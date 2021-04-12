import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).init({
    resources: {
        en: {
            translations: {
                Title: "Survey system",
                Logout: "Logout",
                ChooseCourse: "Choose course with for which you want create a survey",
                AnswerType: "Answer type",
                SingleChoice: "Single choice",
                MultipleChoice: "Multiple choice",
                Answers: "Answeres",
                Yes: "Yes",
                No: "No",
                SaveTemplate: "Save template?",
                ForSelectedSubject: "For selected subject?",
                Questions: "Questions: ",
                Surveys: "Surveys",
                USOSSurveys: "USOS surveys",
                AvailableSurveys: "Available surveys",
                AddSurvey: "Add survey",
                ManageSurveys: "Manage surveys",
                SubjectSurveys: "Subject surveys",
                Welcome: "Welcome in surveys system",
                ChooseModule: "Choose module from drawer",
                ChooseSurveyToManage: "Choose survey which you want to manage",
                ChooseSettingsToNewSurvey: "Choose settings for a new survey",
                Comment: "Comment",
                AllowComment: "Allow commenting?",
                Open: "Open",
                ShareSurvey: "Share the survey?",
                Template: "Template",
                NewSurvey: "New survey",
                FromTemplate: "From template",
                Choose: "Choose",
                Error: "Error",
                PleaseCreateQuestions: "Please, create questions to add new survey",
                Close: "Close",
                Send: "Send",
                SurveysToFill: "Surveys available to fill: ",
                Loading: "Loading...",
                SurveySettings: "Survey settings: ",
                UpdateSurvey: "Update survey",
                SurveyHasNoAnswers: "This survey has not been answered yet",
                SurveyHasNoComments: "This survey has not been commented yet",
                SurveyStatistics: "Survey statistics: ",
                Code: "Code",
                Class: "Class",
                Instructor: "Instructor",
                FillSurvey: "Fill out the survey",
                Settings: "Settings",
                Statistics: "Statistics",
                TypeOfClasses: "Type of classes",
                Semester: "Semester",
                CommentsForSurvey: "Comments for survey: "

            }
        },
        pl: {
            translations: {
                Title: "System ankiet",
                Logout: "Wyloguj",
                ChooseCourse: "Wybierz kurs do którego chcesz utworzyć ankietę",
                AnswerType: "Rodzaj odpowiedzi",
                SingleChoice: "Jednokrotny wybór",
                MultipleChoice: "Wielokrotny wybór",
                Answers: "Odpowiedzi",
                Yes: "Tak",
                No: "Nie",
                SaveTemplate: "Czy zapisać szablon?",
                ForSelectedSubject: "Dla obecnego przedmiotu?",
                Questions: "Pytania: ",
                Surveys: "Ankiety",
                USOSSurveys: "Ankiety USOS",
                AvailableSurveys: "Dostępne ankiety",
                AddSurvey: "Dodaj ankietę",
                ManageSurveys: "Zarządzaj ankietami",
                SubjectSurveys: "Ankiety zajęć",
                Welcome: "Witamy w systemie ankiet",
                ChooseModule: "Wybierz moduł z szuflady",
                ChooseSurveyToManage: "Wybierz ankietę którą chcesz zarządzać",
                ChooseSettingsToNewSurvey: "Wybierz ustawienia nowej ankiety",
                Comment: "Komentarz",
                AllowComment: "Czy pozwolić na komentarz?",
                Open: "Otwarta",
                ShareSurvey: "Czy udostępnić ankietę?",
                Template: "Szablon",
                NewSurvey: "Nowa ankieta",
                FromTemplate: "Z szablonu",
                Choose: "Wybierz",
                Error: "Błąd",
                PleaseCreateQuestions: "Proszę utworzyć pytania, aby dodać nową ankietę",
                Close: "Zamknij",
                Send: "Wyślij",
                SurveysToFill: "Ankiety, które można wypełnić: ",
                Loading: "Ładowanie...",
                SurveySettings: "Ustawienia ankiety: ",
                UpdateSurvey: "Aktualizuj ankietę",
                SurveyHasNoAnswers: "Ta ankieta nie ma jeszcze żadnych odpowiedzi",
                SurveyHasNoComments: "Brak komentarzy do ankiety",
                SurveyStatistics: "Statystyki ankiety: ",
                Code: "Kod",
                Class: "Przedmiot",
                Instructor: "Prowadzący",
                FillSurvey: "Wypełnij ankietę",
                Settings: "Ustawienia",
                Statistics: "Statystyki",
                TypeOfClasses: "Rodzaj zajęć",
                Semester: "Semestr",
                CommentsForSurvey: "Komentarze do ankiety: "
            }
        }
    },
    fallbackLng: "pl",
    debug: true,

    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false,

    interpolation: {
        formatSeparator: ","
    },

    react: {
        wait: true
    }
});

export default i18n;