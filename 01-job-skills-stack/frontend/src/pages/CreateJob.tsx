import { FC, FormEventHandler, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SkillCard from "../components/skill-card/SkillCard";
import { RootState } from "../store";
import { jobsActions } from "../store/jobs/jobs.slice";
import { Skill } from "../store/skills/skills.slice";
import classes from "./CreateJob.module.scss";

type SelectedSkillsMap = {
  [key: string]: Skill | null;
};

type InitialState = {
  nameInput: string;
  selectedSkillsMap: SelectedSkillsMap;
};

const INITIAL_INPUTS_STATE: InitialState = {
  nameInput: "",
  selectedSkillsMap: {},
};

const CreateJob: FC = () => {
  const [inputs, setInputs] = useState(INITIAL_INPUTS_STATE);
  const { nameInput, selectedSkillsMap } = inputs;
  const skills = useSelector((state: RootState) => state.skills.skills);

  console.log("selectedSkillsMap", selectedSkillsMap);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    dispatch(
      jobsActions.createJob({
        jobData: { id: Math.random(), name: nameInput, skills },
      })
    );

    navigate("/");
  };

  const toggleSkillHandler = (skillToToggle: Skill) => {
    if (selectedSkillsMap[skillToToggle.id]) {
      // delete skill
      const newSelectedSkillsMap = { ...selectedSkillsMap };
      newSelectedSkillsMap[skillToToggle.id] = null;
      setInputs((prevState) => ({
        ...prevState,
        selectedSkillsMap: newSelectedSkillsMap,
      }));
    } else {
      // add skill
      const newSelectedSkillsMap = {
        ...selectedSkillsMap,
        [skillToToggle.id]: skillToToggle,
      };
      setInputs((prevState) => ({
        ...prevState,
        selectedSkillsMap: newSelectedSkillsMap,
      }));
    }
  };

  return (
    <div className={classes["form-container"]}>
      <form onSubmit={submitHandler} className={classes["form"]}>
        <label>Job Name</label>
        <input className={classes["form__input"]} />
        <div className={classes["skills-container"]}>
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClick={toggleSkillHandler}
              isActive={!!selectedSkillsMap[skill.id]}
            />
          ))}
        </div>
        <button>Create Job</button>
      </form>
    </div>
  );
};

export default CreateJob;
