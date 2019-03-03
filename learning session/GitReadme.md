//view remotes
git remote -v

//add the upstream
git remote add upstream https://github.com/omrishalev22/learning-session-harman.git

git fetch upstream

-- Shelve changes

git checkout master

git merge upstream/master

-- UN-Shelve changes
