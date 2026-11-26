Blaise Gonsalves – AI portfolio (frontend + chat backend)

1. Add your photo as assets/photo.jpg and your resume as assets/BlaiseGonsalves_Resume.pdf.
2. Edit content.js (links, bio, skills, projects). The chat answers only from this file.
3. Backend: in Netlify, Site settings > Environment variables, add ONE of:
     ANTHROPIC_API_KEY   (Claude, default model claude-haiku-5-5)
     GEMINI_API_KEY      (Gemini, default model gemini-2.5-flash)
   Optional: MODEL to choose a different model.
4. Deploy. Netlify's drag-and-drop does NOT run functions, so use either
     npx netlify-cli deploy --prod     (run in this folder)
   or push this folder to GitHub and import it in Netlify.
5. Local test: npx netlify-cli dev  (put the key in a .env file in this folder).

If the function or key is missing, the site falls back to built-in keyword answers.
