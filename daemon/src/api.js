/**
 * api.js
 * Andrea Tino - 2020
 * 
 * API invocation.
 */

const path = require("path");
const fs = require("fs");

const config = require("./config");
const { spawn } = require("child_process");

/** The API available. */
export const API = {
    compile: "COMPILE",
    draft: "DRAFT"
};

/**
 * 
 * @param {*} api The API code.
 * @param  {...any} params The parameters to pass.
 */
export async function invoke(api, ...params) {
    let result = "";

    switch (api) {
        case API.compile:
            result = await invokeCompile(...params);
            break;
        case API.draft:
            result = await invokeDraft(...params);
            break;
    }

    return result;
}

async function invokeCompile(...params) {
    const compileDirPath = params[0]; // Path to the folder to compile

    if (!compileDirPath) {
        throw new Error("Parameter 'path' cannot be null or undefined");
    }

    return invokeRScript("compile.R", compileDirPath);
}

async function invokeDraft(...params) {
    const templateName = params[0]; // The name of the template
    const draftArtifactFolder = params[1]; // Path to the folder where to save draft artifacts

    if (!templateName) {
        throw new Error("Parameter 'templateName' cannot be null or undefined");
    }
    if (!draftArtifactFolder) {
        throw new Error("Parameter 'draftArtifactFolder' cannot be null or undefined");
    }

    return invokeRScript("draft.R", templateName, draftArtifactFolder);
}

async function invokeRScript(scriptFileName, ...params) {
    const rscriptInfo = config.tryFetchRScriptInfoFromDataDir();
    if (!rscriptInfo) {
        throw new Error("Could not fetch R script info");
    }

    const path2rscript = rscriptInfo.path2rscript;
    if (!path2rscript) {
        throw new Error("Could not find Rscript executable path");
    }

    if (!fs.existsSync(path2rscript) || !fs.statSync(path2rscript).isFile()) {
        throw new Error(`Fetched Rscript path '${path2rscript}' either does not exist or does not point to a file`);
    }

    return new Promise((resolve, reject) => {
        const scriptParams = [path.normalize(path.join(__dirname, "..", "api", scriptFileName))].concat(params);
        const cmd = spawn(path2rscript, scriptParams);

        const buffer = {
            out: "",
            err: ""
        };
        let exitOrCloseRaised = false;
        let exitCode = null;

        cmd.stdout.on("data", (data) => {
            buffer.out = data;
        });
    
        cmd.stderr.on("data", (data) => {
            buffer.err = data;
        });

        cmd.on("error", (err) => {
            reject(err);
        });

        // Make sure to resolve the promise when the process exits
        // and stdio streams have been closed
        const onCompleted = () => {
            if (exitCode !== 0) {
                reject(`${scriptFileName} exited with code ${exitCode}. Errors: ${buffer.err}`);
                return;
            }

            resolve(`${scriptFileName} exited with code ${exitCode}. Output: ${buffer.out}`);
        };
    
        cmd.on("close", (code) => {
            if (!exitOrCloseRaised) {
                exitOrCloseRaised = true;
                return;
            }

            onCompleted();
        });

        cmd.on("exit", (code) => {
            exitCode = code;
            if (!exitOrCloseRaised) {
                exitOrCloseRaised = true;
                return;
            }

            onCompleted();
        });
    });
}
