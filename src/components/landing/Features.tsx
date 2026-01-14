import { motion } from 'framer-motion';
import { Shield, FolderOpen, Palette, Zap, Lock, Cloud } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'Your notes are encrypted and protected with industry-standard security protocols.',
  },
  {
    icon: FolderOpen,
    title: 'Organized Notes',
    description: 'Keep everything organized with tags, favorites, and powerful search capabilities.',
  },
  {
    icon: Palette,
    title: 'Customizable Design',
    description: 'Personalize each note with colors and images to match your style.',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Lightning-fast performance with real-time sync across all your devices.',
  },
  {
    icon: Lock,
    title: 'Private by Default',
    description: 'Your data belongs to you. We never share or sell your information.',
  },
  {
    icon: Cloud,
    title: 'Cloud Backup',
    description: 'Never lose a note again with automatic cloud backup and version history.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete notes solution designed for security, simplicity, and productivity.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
