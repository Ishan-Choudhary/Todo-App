# Todo-App

This is a minimal Todo list app that includes the following functionality:
- Sign up
- Sign in
- Create new tasks
- Give tasks a title and description
- Mark tasks as completed, or revert back to not completed 
- Edit tasks title and description
- Delete tasks
 

 ## HOW TO INSTALL
 1. Clone the repository
 2. Navigate to the `backend` folder
 3. Create a new python virtual environment, and activate it:
     ```
        > python3 -m venv ./
        > source bin/activate
    ```
 4. Download required pip modules
    ```
    > pythom3 -m pip install -r requirements.txt
    
    ```
 5. Run the backend:
    ```
    > cd src
    > python3 manage.py runserver
    ```
 6. In a new terminal window, navigate to the `frontend` folder. Then install node modules using the command:
    ```
    > npm i
    ```
 7. Start the frontend
    ```
    > npm run start
    ```
