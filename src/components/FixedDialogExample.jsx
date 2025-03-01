import { Dialog, DialogTitle, DialogContent, DialogActions } from 'your-ui-library'; // Replace with your actual import

// INCORRECT USAGE (causing the error):
// function ErrorExample() {
//   return (
//     <div>
//       <DialogTitle>This causes an error</DialogTitle>
//       <p>Content</p>
//     </div>
//   );
// }

// CORRECT USAGE:
function FixedExample() {
  return (
    <Dialog open={true} onClose={() => {}}>
      <DialogTitle>This is correct</DialogTitle>
      <DialogContent>
        <p>Your content here</p>
      </DialogContent>
      <DialogActions>
        <button>Close</button>
      </DialogActions>
    </Dialog>
  );
}

export default FixedExample;
