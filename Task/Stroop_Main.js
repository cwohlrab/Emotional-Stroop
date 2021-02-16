// Use JSDELIVR to get the files from a GitHub repository
// https://cdn.jsdelivr.net/gh/<github-username>/<repository-name>/
var repo_site = "https://cdn.jsdelivr.net/gh/cwohlrab/Emotional-Stroop/";

/* experiment parameters */
var reps_per_trial_type = 2;

/*set up welcome block*/
var welcome = {
    type: "html-keyboard-response",
    stimulus: "Welcome to the experiment. Press any key to begin."
};

/*set up instructions block*/
var instructions = {
    type: "html-keyboard-response",
    stimulus: "<p>In this task, you will see colored words appear on the screen.</p>" +
        "<p>Press the R key if the word is printed in RED (<)</p>" +
        "<p>Press the B key if the word is printed in BLUE(>)</p>" +
        "<p>Press the G key if the word is printed in GREEN(>)</p>" +
        "<p>Press the Y key if the word is printed in YELLOW(>)</p>" +
        "<p>Press any key to begin.</p>",
    post_trial_gap: 1000
};

/*defining stimuli*/
var test_stimuli = [{
        stimulus: repo_site + "img/Slide1.jpg",
        data: {
            stim_type: 'congruent',
            word_type: 'soc_pos_red'
        }
    },
    {
        stimulus: repo_site + "img/Slide286.jpg",
        data: {
            stim_type: 'congruent',
            word_type: 'emo_neg_yellow'
        }
    },
    {
        stimulus: repo_site + "img/Slide401.jpg",
        data: {
            stim_type: 'incongruent',
            word_type: 'color_white'
        }
    },
    {
        stimulus: repo_site + "img/Slide168.jpg",
        data: {
            stim_type: 'incongruent',
            word_type: 'emo_pos_green'
        }
    }
];


/* defining test timeline */
var test = {
    timeline: [{
        type: 'image-keyboard-response',
        choices: [37, 39],
        trial_duration: 1500,
        stimulus: jsPsych.timelineVariable('stimulus'),
        data: jsPsych.timelineVariable('data'),
        on_finish: function (data) {
            var correct = false;
            if (data.word_type == 'emo_pos_green' && data.key_press == 71 && data.rt > -1) {
                correct = true;
            } else if (data.word_type == 'emo_neg_yellow' && data.key_press == 89 && data.rt > -1) {
                correct = true;
            }
            data.correct = correct;
        },
        post_trial_gap: function () {
            return Math.floor(Math.random() * 1500) + 500;
        }
    }],
    timeline_variables: test_stimuli,
    sample: {
        type: 'fixed-repetitions',
        size: reps_per_trial_type
    }
};


/*defining debriefing block*/
var debrief = {
    type: "html-keyboard-response",
    stimulus: function () {
        var total_trials = jsPsych.data.get().filter({
            trial_type: 'image-keyboard-response'
        }).count();
        var accuracy = Math.round(jsPsych.data.get().filter({
            correct: true
        }).count() / total_trials * 100);
        var congruent_rt = Math.round(jsPsych.data.get().filter({
            correct: true,
            stim_type: 'congruent'
        }).select('rt').mean());
        var incongruent_rt = Math.round(jsPsych.data.get().filter({
            correct: true,
            stim_type: 'incongruent'
        }).select('rt').mean());
        return "<p>You responded correctly on <strong>" + accuracy + "%</strong> of the trials.</p> " +
            "<p>Your average response time for congruent trials was <strong>" + congruent_rt + "ms</strong>.</p>" +
            "<p>Your average response time for incongruent trials was <strong>" + incongruent_rt + "ms</strong>.</p>" +
            "<p>Press any key to complete the experiment. Thank you!</p>";
    }
};

/*set up experiment structure*/
var timeline = [];
timeline.push(welcome);
timeline.push(instructions);
timeline.push(test);
timeline.push(debrief);
