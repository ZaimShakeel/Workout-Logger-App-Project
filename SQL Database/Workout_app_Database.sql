--
-- PostgreSQL database dump
--

\restrict O9bKFkQ5q7Vi6TsP087JKW1fqfNE8UV84EyOyUUZelXi9jLiFzQ01zMA7QgaH7e

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-12-06 00:35:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16764)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    userid integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    createdat timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16763)
-- Name: User_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_userid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_userid_seq" OWNER TO postgres;

--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 219
-- Name: User_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_userid_seq" OWNED BY public."User".userid;


--
-- TOC entry 231 (class 1259 OID 16864)
-- Name: exercise_muscles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercise_muscles (
    exerciseid integer NOT NULL,
    muscleid integer NOT NULL,
    role character varying(20),
    CONSTRAINT exercise_muscles_role_check CHECK (((role)::text = ANY ((ARRAY['Primary'::character varying, 'Secondary'::character varying, 'Stabilizer'::character varying])::text[])))
);


ALTER TABLE public.exercise_muscles OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16793)
-- Name: exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercises (
    exerciseid integer NOT NULL,
    exercisename character varying(100) NOT NULL,
    instructions text,
    effectivenessrating integer,
    CONSTRAINT exercises_baselineeffectiveness_check CHECK (((effectivenessrating >= 1) AND (effectivenessrating <= 5)))
);


ALTER TABLE public.exercises OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16792)
-- Name: exercises_exerciseid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exercises_exerciseid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exercises_exerciseid_seq OWNER TO postgres;

--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 223
-- Name: exercises_exerciseid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exercises_exerciseid_seq OWNED BY public.exercises.exerciseid;


--
-- TOC entry 230 (class 1259 OID 16840)
-- Name: logdetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logdetail (
    logdetailid integer NOT NULL,
    sets integer DEFAULT 0 NOT NULL,
    reps integer DEFAULT 0 NOT NULL,
    exerciseid integer NOT NULL,
    logid integer NOT NULL,
    weight_lb numeric,
    weight_kg numeric,
    unit character varying(5)
);


ALTER TABLE public.logdetail OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16839)
-- Name: logdetail_logdetailid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logdetail_logdetailid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logdetail_logdetailid_seq OWNER TO postgres;

--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 229
-- Name: logdetail_logdetailid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logdetail_logdetailid_seq OWNED BY public.logdetail.logdetailid;


--
-- TOC entry 222 (class 1259 OID 16782)
-- Name: muscles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.muscles (
    muscleid integer NOT NULL,
    musclename character varying(50) NOT NULL,
    bodypart character varying(50),
    motiongroup character varying(50)
);


ALTER TABLE public.muscles OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16781)
-- Name: muscles_muscleid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.muscles_muscleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.muscles_muscleid_seq OWNER TO postgres;

--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 221
-- Name: muscles_muscleid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.muscles_muscleid_seq OWNED BY public.muscles.muscleid;


--
-- TOC entry 232 (class 1259 OID 16882)
-- Name: plan_contains_exercise; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_contains_exercise (
    workoutid integer NOT NULL,
    exerciseid integer NOT NULL
);


ALTER TABLE public.plan_contains_exercise OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16917)
-- Name: plan_records_logdetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_records_logdetail (
    workoutid integer NOT NULL,
    logdetailid integer NOT NULL
);


ALTER TABLE public.plan_records_logdetail OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16899)
-- Name: user_records_exercise; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_records_exercise (
    userid integer NOT NULL,
    exerciseid integer NOT NULL,
    personaleffectiveness integer,
    CONSTRAINT user_records_exercise_personaleffectiveness_check CHECK (((personaleffectiveness >= 1) AND (personaleffectiveness <= 5)))
);


ALTER TABLE public.user_records_exercise OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16823)
-- Name: workoutlog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workoutlog (
    logid integer NOT NULL,
    notes text,
    logdate timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    userid integer NOT NULL,
    focus text
);


ALTER TABLE public.workoutlog OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16822)
-- Name: workoutlog_logid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workoutlog_logid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workoutlog_logid_seq OWNER TO postgres;

--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 227
-- Name: workoutlog_logid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workoutlog_logid_seq OWNED BY public.workoutlog.logid;


--
-- TOC entry 226 (class 1259 OID 16806)
-- Name: workoutplan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workoutplan (
    workoutid integer NOT NULL,
    planname character varying(100) NOT NULL,
    description text,
    userid integer NOT NULL
);


ALTER TABLE public.workoutplan OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16805)
-- Name: workoutplan_workoutid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workoutplan_workoutid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workoutplan_workoutid_seq OWNER TO postgres;

--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 225
-- Name: workoutplan_workoutid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workoutplan_workoutid_seq OWNED BY public.workoutplan.workoutid;


--
-- TOC entry 4897 (class 2604 OID 16767)
-- Name: User userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN userid SET DEFAULT nextval('public."User_userid_seq"'::regclass);


--
-- TOC entry 4900 (class 2604 OID 16796)
-- Name: exercises exerciseid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises ALTER COLUMN exerciseid SET DEFAULT nextval('public.exercises_exerciseid_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 16843)
-- Name: logdetail logdetailid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logdetail ALTER COLUMN logdetailid SET DEFAULT nextval('public.logdetail_logdetailid_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 16785)
-- Name: muscles muscleid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muscles ALTER COLUMN muscleid SET DEFAULT nextval('public.muscles_muscleid_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 16826)
-- Name: workoutlog logid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workoutlog ALTER COLUMN logid SET DEFAULT nextval('public.workoutlog_logid_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 16809)
-- Name: workoutplan workoutid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workoutplan ALTER COLUMN workoutid SET DEFAULT nextval('public.workoutplan_workoutid_seq'::regclass);


--
-- TOC entry 5098 (class 0 OID 16764)
-- Dependencies: 220
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES (1, 'testuser', 'test@test.com', '$2b$10$1f2MnASfDQnFsaBxmd9BXewf47t9hsi6JtGIQPvRL2wXyBTbXg1OK', '2025-11-07 12:23:40.80144-05');
INSERT INTO public."User" VALUES (2, 'AztezIsCool', 'zaimshakeel@gmail.com', '$2b$10$D4pwgS.gQ.zRyZnA2h67UexpI4ChWJFbRFwt6EOdW.AnjxVxRMbk6', '2025-11-09 14:26:51.849702-05');
INSERT INTO public."User" VALUES (3, 'zaimshakeel', 'zaimshakeel0@gmail.com', '$2b$10$/4hbTgFheCcQUmrPIhxtJu6efG1DxBPWBO1EpSjvikkBmxkMaEE2y', '2025-12-05 23:27:25.682137-05');
INSERT INTO public."User" VALUES (4, 'ZaimShakeel1', 'zaimshakeel1@gmail.com', '$2b$10$6LKQWo97XMncoJYV9ttqVeWBUQSKiH9Z1ddHoTsVr52De31tDSKcS', '2025-12-06 00:03:26.635222-05');


--
-- TOC entry 5109 (class 0 OID 16864)
-- Dependencies: 231
-- Data for Name: exercise_muscles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.exercise_muscles VALUES (1, 1, 'Primary');
INSERT INTO public.exercise_muscles VALUES (1, 7, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (1, 11, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (2, 2, 'Primary');
INSERT INTO public.exercise_muscles VALUES (2, 7, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (2, 11, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (3, 7, 'Primary');
INSERT INTO public.exercise_muscles VALUES (3, 11, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (3, 2, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (4, 11, 'Primary');
INSERT INTO public.exercise_muscles VALUES (4, 3, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (5, 1, 'Primary');
INSERT INTO public.exercise_muscles VALUES (5, 11, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (6, 8, 'Primary');
INSERT INTO public.exercise_muscles VALUES (7, 11, 'Primary');
INSERT INTO public.exercise_muscles VALUES (8, 14, 'Primary');
INSERT INTO public.exercise_muscles VALUES (8, 15, 'Primary');
INSERT INTO public.exercise_muscles VALUES (8, 6, 'Primary');
INSERT INTO public.exercise_muscles VALUES (8, 4, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (9, 4, 'Primary');
INSERT INTO public.exercise_muscles VALUES (9, 10, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (9, 5, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (10, 5, 'Primary');
INSERT INTO public.exercise_muscles VALUES (10, 4, 'Primary');
INSERT INTO public.exercise_muscles VALUES (10, 10, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (11, 4, 'Primary');
INSERT INTO public.exercise_muscles VALUES (11, 10, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (12, 9, 'Primary');
INSERT INTO public.exercise_muscles VALUES (12, 5, 'Primary');
INSERT INTO public.exercise_muscles VALUES (13, 10, 'Primary');
INSERT INTO public.exercise_muscles VALUES (14, 10, 'Primary');
INSERT INTO public.exercise_muscles VALUES (14, 12, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (15, 13, 'Primary');
INSERT INTO public.exercise_muscles VALUES (15, 15, 'Primary');
INSERT INTO public.exercise_muscles VALUES (15, 14, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (16, 14, 'Primary');
INSERT INTO public.exercise_muscles VALUES (16, 15, 'Primary');
INSERT INTO public.exercise_muscles VALUES (17, 13, 'Primary');
INSERT INTO public.exercise_muscles VALUES (17, 15, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (18, 13, 'Primary');
INSERT INTO public.exercise_muscles VALUES (18, 15, 'Primary');
INSERT INTO public.exercise_muscles VALUES (19, 13, 'Primary');
INSERT INTO public.exercise_muscles VALUES (20, 14, 'Primary');
INSERT INTO public.exercise_muscles VALUES (21, 16, 'Primary');
INSERT INTO public.exercise_muscles VALUES (22, 17, 'Primary');
INSERT INTO public.exercise_muscles VALUES (23, 17, 'Primary');
INSERT INTO public.exercise_muscles VALUES (23, 18, 'Secondary');
INSERT INTO public.exercise_muscles VALUES (26, 4, 'Primary');


--
-- TOC entry 5102 (class 0 OID 16793)
-- Dependencies: 224
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.exercises VALUES (1, 'Barbell Bench Press', 'Lie on flat bench, lower bar to mid-chest, press back up.', 5);
INSERT INTO public.exercises VALUES (2, 'Incline Dumbbell Press', 'Set bench to 30 degrees. Press dumbbells overhead.', 4);
INSERT INTO public.exercises VALUES (3, 'Overhead Press (Military)', 'Standing, press barbell from collarbone strictly overhead.', 5);
INSERT INTO public.exercises VALUES (4, 'Dips', 'Lower body on parallel bars until elbows are at 90 degrees, push back up.', 5);
INSERT INTO public.exercises VALUES (5, 'Push-Up', 'Plank position, lower chest to floor, push back up.', 4);
INSERT INTO public.exercises VALUES (6, 'Dumbbell Lateral Raise', 'Raise dumbbells to the side until shoulder level.', 4);
INSERT INTO public.exercises VALUES (7, 'Tricep Rope Pushdown', 'Elbows by sides, extend arms down spreading rope at bottom.', 3);
INSERT INTO public.exercises VALUES (8, 'Deadlift', 'Hinge at hips, lift bar from floor keeping back straight.', 5);
INSERT INTO public.exercises VALUES (9, 'Pull-Up', 'Hang from bar, pull chin over bar.', 5);
INSERT INTO public.exercises VALUES (10, 'Barbell Row', 'Bent over 45 degrees, pull bar to lower chest/upper stomach.', 5);
INSERT INTO public.exercises VALUES (11, 'Lat Pulldown', 'Seated, pull bar down to upper chest.', 4);
INSERT INTO public.exercises VALUES (12, 'Face Pulls', 'Pull rope towards eyes, separating hands and squeezing rear delts.', 4);
INSERT INTO public.exercises VALUES (13, 'Barbell Bicep Curl', 'Curl bar upwards while keeping elbows pinned to sides.', 3);
INSERT INTO public.exercises VALUES (14, 'Hammer Curl', 'Curl dumbbells with palms facing each other (neutral grip).', 3);
INSERT INTO public.exercises VALUES (15, 'Barbell Back Squat', 'Bar on upper back, sit down until thighs parallel to floor.', 5);
INSERT INTO public.exercises VALUES (16, 'Romanian Deadlift (RDL)', 'Slight knee bend, hinge hips back lowering bar just below knees.', 5);
INSERT INTO public.exercises VALUES (17, 'Leg Press', 'Seated in machine, lower sled until knees at 90 degrees, press up.', 4);
INSERT INTO public.exercises VALUES (18, 'Bulgarian Split Squat', 'One foot on bench behind you, lower hips until front thigh is parallel.', 5);
INSERT INTO public.exercises VALUES (19, 'Leg Extension', 'Seated, extend knees until legs are straight.', 3);
INSERT INTO public.exercises VALUES (20, 'Lying Leg Curl', 'Lie face down, curl heels towards glutes.', 4);
INSERT INTO public.exercises VALUES (21, 'Calf Raise (Standing)', 'Rise up onto toes, pause, lower heels below platform level.', 3);
INSERT INTO public.exercises VALUES (22, 'Plank', 'Hold pushup position resting on forearms. Keep body rigid.', 4);
INSERT INTO public.exercises VALUES (23, 'Hanging Leg Raise', 'Hang from bar, lift legs until parallel to floor.', 4);
INSERT INTO public.exercises VALUES (24, 'Cable Crossover', 'Stand between two pulleys, pull handles down and across your chest.', 4);
INSERT INTO public.exercises VALUES (25, 'Seated Dumbbell Press', 'Sit on a bench with back support, press dumbbells overhead.', 4);
INSERT INTO public.exercises VALUES (26, 'T-Bar Row', 'Straddle a bar, pull it towards your chest while keeping your back straight.', 5);
INSERT INTO public.exercises VALUES (27, 'Preacher Curl', 'Sit at preacher bench, curl bar upwards keeping upper arms firmly on pad.', 4);
INSERT INTO public.exercises VALUES (28, 'Skull Crushers', 'Lie on bench, lower bar/dumbbells to forehead by bending elbows only.', 4);
INSERT INTO public.exercises VALUES (29, 'Cable Lateral Raise', 'Stand next to low pulley, raise handle out to side until shoulder height.', 4);
INSERT INTO public.exercises VALUES (30, 'Machine Lateral Raise', 'Sit in machine, raise elbows out to sides against pads.', 3);
INSERT INTO public.exercises VALUES (31, 'Dumbbell Front Raise', 'Raise dumbbells straight in front of you until shoulder height.', 3);
INSERT INTO public.exercises VALUES (32, 'Seated Calf Raise', 'Sit at machine, lift weight by pushing toes down, lower slowly.', 3);
INSERT INTO public.exercises VALUES (33, 'Cable Fly', 'Stand between pulleys, pull handles together in front of chest with slight elbow bend.', 4);
INSERT INTO public.exercises VALUES (34, 'Pec Deck (Machine Fly)', 'Sit in machine, bring arms together in front of chest.', 3);
INSERT INTO public.exercises VALUES (35, 'Dumbbell Shrug', 'Hold heavy dumbbells at sides, shrug shoulders straight up towards ears.', 3);
INSERT INTO public.exercises VALUES (36, 'Concentration Curl', 'Sit on bench, rest elbow on inner thigh, curl dumbbell without moving upper arm.', 4);
INSERT INTO public.exercises VALUES (37, 'Rope Hammer Curl', 'Use rope attachment on low pulley, curl with neutral (palms facing each other) grip.', 4);
INSERT INTO public.exercises VALUES (38, 'Barbell Hip Thrust', 'Sit on floor back against bench, bar on hips. Thrust hips upward until locked out.', 5);
INSERT INTO public.exercises VALUES (39, 'Glute Bridge', 'Lie on floor, knees bent, lift hips towards ceiling squeezing glutes.', 4);
INSERT INTO public.exercises VALUES (40, 'Walking Lunge', 'Step forward, lower back knee to ground, push off front foot into next step.', 5);


--
-- TOC entry 5108 (class 0 OID 16840)
-- Dependencies: 230
-- Data for Name: logdetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.logdetail VALUES (2, 3, 10, 1, 2, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (3, 3, 10, 15, 5, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (4, 3, 10, 10, 5, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (5, 3, 10, 1, 6, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (6, 3, 10, 4, 6, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (7, 3, 10, 2, 6, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (8, 43, 10, 38, 6, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (10, 3, 10, 38, 8, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (11, 3, 10, 13, 17, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (12, 3, 10, 13, 18, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (13, 3, 10, 24, 18, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (14, 3, 10, 13, 29, NULL, NULL, NULL);
INSERT INTO public.logdetail VALUES (16, 3, 10, 18, 31, 300, 136.07787283069192, 'lb');
INSERT INTO public.logdetail VALUES (18, 3, 10, 13, 33, 5, 2.267964547178199, 'lb');
INSERT INTO public.logdetail VALUES (17, 4, 12, 24, 32, 35, 15.87575183024739, 'lb');
INSERT INTO public.logdetail VALUES (19, 3, 12, 1, 34, 115, 52.16318458509857, 'lb');
INSERT INTO public.logdetail VALUES (20, 4, 12, 1, 35, 120, 54.43114913227677, 'lb');
INSERT INTO public.logdetail VALUES (22, 4, 12, 1, 36, 300, 136.07787283069192, 'lb');
INSERT INTO public.logdetail VALUES (21, 4, 15, 33, 36, 60, 27.215574566138386, 'lb');


--
-- TOC entry 5100 (class 0 OID 16782)
-- Dependencies: 222
-- Data for Name: muscles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.muscles VALUES (1, 'Chest (General)', 'Chest', 'Push');
INSERT INTO public.muscles VALUES (2, 'Upper Chest', 'Chest', 'Push');
INSERT INTO public.muscles VALUES (3, 'Lower Chest', 'Chest', 'Push');
INSERT INTO public.muscles VALUES (4, 'Lats', 'Back', 'Pull');
INSERT INTO public.muscles VALUES (5, 'Upper Back (Traps/Rhomboids)', 'Back', 'Pull');
INSERT INTO public.muscles VALUES (6, 'Lower Back', 'Back', 'Pull');
INSERT INTO public.muscles VALUES (7, 'Front Delts', 'Shoulders', 'Push');
INSERT INTO public.muscles VALUES (8, 'Side Delts', 'Shoulders', 'Push');
INSERT INTO public.muscles VALUES (9, 'Rear Delts', 'Shoulders', 'Pull');
INSERT INTO public.muscles VALUES (10, 'Biceps', 'Arms', 'Pull');
INSERT INTO public.muscles VALUES (11, 'Triceps', 'Arms', 'Push');
INSERT INTO public.muscles VALUES (12, 'Forearms', 'Arms', 'Pull');
INSERT INTO public.muscles VALUES (13, 'Quads', 'Legs', 'Legs');
INSERT INTO public.muscles VALUES (14, 'Hamstrings', 'Legs', 'Legs');
INSERT INTO public.muscles VALUES (15, 'Glutes', 'Legs', 'Legs');
INSERT INTO public.muscles VALUES (16, 'Calves', 'Legs', 'Legs');
INSERT INTO public.muscles VALUES (17, 'Abs', 'Core', 'Core');
INSERT INTO public.muscles VALUES (18, 'Obliques', 'Core', 'Core');


--
-- TOC entry 5110 (class 0 OID 16882)
-- Dependencies: 232
-- Data for Name: plan_contains_exercise; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5112 (class 0 OID 16917)
-- Dependencies: 234
-- Data for Name: plan_records_logdetail; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5111 (class 0 OID 16899)
-- Dependencies: 233
-- Data for Name: user_records_exercise; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5106 (class 0 OID 16823)
-- Dependencies: 228
-- Data for Name: workoutlog; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.workoutlog VALUES (2, 'Actually felt kinda tired', '2025-11-09 14:03:21.554024-05', 1, NULL);
INSERT INTO public.workoutlog VALUES (3, 'good', '2025-11-09 14:42:16.480238-05', 1, NULL);
INSERT INTO public.workoutlog VALUES (5, '', '2025-11-10 17:52:11.42222-05', 1, NULL);
INSERT INTO public.workoutlog VALUES (6, 'Feeling Pretty Good', '2025-11-10 20:18:11.530822-05', 1, NULL);
INSERT INTO public.workoutlog VALUES (8, '', '2025-12-02 12:34:41.148219-05', 1, 'Push');
INSERT INTO public.workoutlog VALUES (17, '', '2025-12-02 13:23:42.803637-05', 1, 'Push');
INSERT INTO public.workoutlog VALUES (18, '', '2025-12-02 13:23:52.047935-05', 1, 'Push');
INSERT INTO public.workoutlog VALUES (29, '', '2025-12-02 13:52:35.505485-05', 1, 'Push');
INSERT INTO public.workoutlog VALUES (31, '', '2025-12-02 14:18:59.287781-05', 1, 'Push');
INSERT INTO public.workoutlog VALUES (33, '', '2025-12-05 18:29:49.526414-05', 1, 'Back');
INSERT INTO public.workoutlog VALUES (32, 'Great Leg Workout', '2025-12-02 14:21:43.708197-05', 1, 'Legs');
INSERT INTO public.workoutlog VALUES (34, '', '2025-12-05 21:48:33.979181-05', 1, 'Chest');
INSERT INTO public.workoutlog VALUES (35, '', '2025-12-05 21:48:48.960793-05', 1, 'Chest');
INSERT INTO public.workoutlog VALUES (36, 'Feeling Great today', '2025-12-06 00:05:40.435164-05', 1, 'Chest');


--
-- TOC entry 5104 (class 0 OID 16806)
-- Dependencies: 226
-- Data for Name: workoutplan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.workoutplan VALUES (1, 'Test Push Day', 'My first test routine', 1);


--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 219
-- Name: User_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_userid_seq"', 4, true);


--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 223
-- Name: exercises_exerciseid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercises_exerciseid_seq', 40, true);


--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 229
-- Name: logdetail_logdetailid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logdetail_logdetailid_seq', 22, true);


--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 221
-- Name: muscles_muscleid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.muscles_muscleid_seq', 18, true);


--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 227
-- Name: workoutlog_logid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workoutlog_logid_seq', 36, true);


--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 225
-- Name: workoutplan_workoutid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workoutplan_workoutid_seq', 1, true);


--
-- TOC entry 4911 (class 2606 OID 16780)
-- Name: User User_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key" UNIQUE (email);


--
-- TOC entry 4913 (class 2606 OID 16776)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (userid);


--
-- TOC entry 4915 (class 2606 OID 16778)
-- Name: User User_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_username_key" UNIQUE (username);


--
-- TOC entry 4931 (class 2606 OID 16871)
-- Name: exercise_muscles exercise_muscles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_muscles
    ADD CONSTRAINT exercise_muscles_pkey PRIMARY KEY (exerciseid, muscleid);


--
-- TOC entry 4921 (class 2606 OID 16804)
-- Name: exercises exercises_exercisename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_exercisename_key UNIQUE (exercisename);


--
-- TOC entry 4923 (class 2606 OID 16802)
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (exerciseid);


--
-- TOC entry 4929 (class 2606 OID 16853)
-- Name: logdetail logdetail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logdetail
    ADD CONSTRAINT logdetail_pkey PRIMARY KEY (logdetailid);


--
-- TOC entry 4917 (class 2606 OID 16791)
-- Name: muscles muscles_musclename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muscles
    ADD CONSTRAINT muscles_musclename_key UNIQUE (musclename);


--
-- TOC entry 4919 (class 2606 OID 16789)
-- Name: muscles muscles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.muscles
    ADD CONSTRAINT muscles_pkey PRIMARY KEY (muscleid);


--
-- TOC entry 4933 (class 2606 OID 16888)
-- Name: plan_contains_exercise plan_contains_exercise_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_contains_exercise
    ADD CONSTRAINT plan_contains_exercise_pkey PRIMARY KEY (workoutid, exerciseid);


--
-- TOC entry 4937 (class 2606 OID 16923)
-- Name: plan_records_logdetail plan_records_logdetail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_records_logdetail
    ADD CONSTRAINT plan_records_logdetail_pkey PRIMARY KEY (workoutid, logdetailid);


--
-- TOC entry 4935 (class 2606 OID 16906)
-- Name: user_records_exercise user_records_exercise_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_records_exercise
    ADD CONSTRAINT user_records_exercise_pkey PRIMARY KEY (userid, exerciseid);


--
-- TOC entry 4927 (class 2606 OID 16833)
-- Name: workoutlog workoutlog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workoutlog
    ADD CONSTRAINT workoutlog_pkey PRIMARY KEY (logid);


--
-- TOC entry 4925 (class 2606 OID 16816)
-- Name: workoutplan workoutplan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workoutplan
    ADD CONSTRAINT workoutplan_pkey PRIMARY KEY (workoutid);


--
-- TOC entry 4942 (class 2606 OID 16872)
-- Name: exercise_muscles fk_exmuscles_exercise; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_muscles
    ADD CONSTRAINT fk_exmuscles_exercise FOREIGN KEY (exerciseid) REFERENCES public.exercises(exerciseid) ON DELETE CASCADE;


--
-- TOC entry 4943 (class 2606 OID 16877)
-- Name: exercise_muscles fk_exmuscles_muscle; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_muscles
    ADD CONSTRAINT fk_exmuscles_muscle FOREIGN KEY (muscleid) REFERENCES public.muscles(muscleid) ON DELETE CASCADE;


--
-- TOC entry 4940 (class 2606 OID 16854)
-- Name: logdetail fk_logdetail_exercise; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logdetail
    ADD CONSTRAINT fk_logdetail_exercise FOREIGN KEY (exerciseid) REFERENCES public.exercises(exerciseid) ON DELETE RESTRICT;


--
-- TOC entry 4941 (class 2606 OID 16859)
-- Name: logdetail fk_logdetail_log; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logdetail
    ADD CONSTRAINT fk_logdetail_log FOREIGN KEY (logid) REFERENCES public.workoutlog(logid) ON DELETE CASCADE;


--
-- TOC entry 4944 (class 2606 OID 16894)
-- Name: plan_contains_exercise fk_plan_contains_exercise; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_contains_exercise
    ADD CONSTRAINT fk_plan_contains_exercise FOREIGN KEY (exerciseid) REFERENCES public.exercises(exerciseid) ON DELETE CASCADE;


--
-- TOC entry 4945 (class 2606 OID 16889)
-- Name: plan_contains_exercise fk_plan_contains_workout; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_contains_exercise
    ADD CONSTRAINT fk_plan_contains_workout FOREIGN KEY (workoutid) REFERENCES public.workoutplan(workoutid) ON DELETE CASCADE;


--
-- TOC entry 4948 (class 2606 OID 16929)
-- Name: plan_records_logdetail fk_plan_records_logdetail; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_records_logdetail
    ADD CONSTRAINT fk_plan_records_logdetail FOREIGN KEY (logdetailid) REFERENCES public.logdetail(logdetailid) ON DELETE CASCADE;


--
-- TOC entry 4949 (class 2606 OID 16924)
-- Name: plan_records_logdetail fk_plan_records_workout; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_records_logdetail
    ADD CONSTRAINT fk_plan_records_workout FOREIGN KEY (workoutid) REFERENCES public.workoutplan(workoutid) ON DELETE CASCADE;


--
-- TOC entry 4946 (class 2606 OID 16912)
-- Name: user_records_exercise fk_user_records_exercise; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_records_exercise
    ADD CONSTRAINT fk_user_records_exercise FOREIGN KEY (exerciseid) REFERENCES public.exercises(exerciseid) ON DELETE CASCADE;


--
-- TOC entry 4947 (class 2606 OID 16907)
-- Name: user_records_exercise fk_user_records_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_records_exercise
    ADD CONSTRAINT fk_user_records_user FOREIGN KEY (userid) REFERENCES public."User"(userid) ON DELETE CASCADE;


--
-- TOC entry 4939 (class 2606 OID 16834)
-- Name: workoutlog fk_workoutlog_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workoutlog
    ADD CONSTRAINT fk_workoutlog_user FOREIGN KEY (userid) REFERENCES public."User"(userid) ON DELETE CASCADE;


--
-- TOC entry 4938 (class 2606 OID 16817)
-- Name: workoutplan fk_workoutplan_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workoutplan
    ADD CONSTRAINT fk_workoutplan_user FOREIGN KEY (userid) REFERENCES public."User"(userid) ON DELETE CASCADE;


-- Completed on 2025-12-06 00:35:26

--
-- PostgreSQL database dump complete
--

\unrestrict O9bKFkQ5q7Vi6TsP087JKW1fqfNE8UV84EyOyUUZelXi9jLiFzQ01zMA7QgaH7e

